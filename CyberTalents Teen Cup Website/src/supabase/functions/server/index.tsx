import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Initialize storage bucket for team logos
async function initStorage() {
  const bucketName = 'make-e5b94f28-team-logos'
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false })
    console.log('Created team logos bucket')
  }
}

initStorage().catch(console.error)

// Health check
app.get('/make-server-e5b94f28/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ========== ADMIN AUTH ==========

app.post('/make-server-e5b94f28/admin/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true // Auto-confirm email
    })
    
    if (error) {
      console.error('Admin signup error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Store admin info in KV
    await kv.set(`admin:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      createdAt: new Date().toISOString()
    })
    
    return c.json({ success: true, user: data.user })
  } catch (error) {
    console.error('Admin signup exception:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== TEAM AUTH ==========

app.post('/make-server-e5b94f28/team/signup', async (c) => {
  try {
    const { email, password, teamName, region, members, logo } = await c.req.json()
    
    // Validate
    if (!email || !password || !teamName || !region || !members || members.length === 0) {
      return c.json({ error: 'Bütün məlumatları daxil edin' }, 400)
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { teamName, role: 'team' },
      email_confirm: true
    })
    
    if (authError) {
      console.error('Team signup auth error:', authError)
      return c.json({ error: authError.message }, 400)
    }
    
    const teamId = authData.user.id
    
    // Store team info
    const team = {
      id: teamId,
      email,
      name: teamName,
      region,
      logo: logo || null,
      status: 'İştirakçı',
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`team:${teamId}`, team)
    
    // Store team members
    for (const member of members) {
      const memberId = crypto.randomUUID()
      await kv.set(`team_member:${teamId}:${memberId}`, {
        id: memberId,
        teamId,
        name: member.name,
        age: member.age,
        email: member.email,
        phone: member.phone
      })
    }
    
    // Initialize results for 3 stages
    await kv.set(`results:${teamId}`, {
      teamId,
      stage1: { score: 0, time: 0, completed: false }, // Online exam
      stage2: { score: 0, time: 0, completed: false }, // On-site exam
      stage3: { score: 0, time: 0, completed: false }, // Practical challenge
      totalScore: 0
    })
    
    return c.json({ success: true, teamId, team })
  } catch (error) {
    console.error('Team signup exception:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== TEAMS ==========

app.get('/make-server-e5b94f28/teams', async (c) => {
  try {
    const teams = await kv.getByPrefix('team:')
    return c.json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.get('/make-server-e5b94f28/team/:id', async (c) => {
  try {
    const teamId = c.req.param('id')
    const team = await kv.get(`team:${teamId}`)
    
    if (!team) {
      return c.json({ error: 'Komanda tapılmadı' }, 404)
    }
    
    const members = await kv.getByPrefix(`team_member:${teamId}:`)
    const results = await kv.get(`results:${teamId}`)
    
    return c.json({ team, members, results })
  } catch (error) {
    console.error('Error fetching team:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== ADMIN TEAM MANAGEMENT ==========

app.post('/make-server-e5b94f28/admin/team/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { name, region, email, members, logo, status } = await c.req.json()
    const teamId = crypto.randomUUID()
    
    const team = {
      id: teamId,
      email: email || '',
      name,
      region,
      logo: logo || null,
      status: status || 'İştirakçı',
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`team:${teamId}`, team)
    
    // Store members if provided
    if (members && members.length > 0) {
      for (const member of members) {
        const memberId = crypto.randomUUID()
        await kv.set(`team_member:${teamId}:${memberId}`, {
          id: memberId,
          teamId,
          name: member.name,
          age: member.age || null,
          email: member.email || null,
          phone: member.phone || null
        })
      }
    }
    
    // Initialize results
    await kv.set(`results:${teamId}`, {
      teamId,
      stage1: { score: 0, time: 0, completed: false },
      stage2: { score: 0, time: 0, completed: false },
      stage3: { score: 0, time: 0, completed: false },
      totalScore: 0
    })
    
    return c.json({ success: true, team })
  } catch (error) {
    console.error('Error creating team:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.put('/make-server-e5b94f28/admin/team/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const teamId = c.req.param('id')
    const updates = await c.req.json()
    
    const existingTeam = await kv.get(`team:${teamId}`)
    if (!existingTeam) {
      return c.json({ error: 'Komanda tapılmadı' }, 404)
    }
    
    const updatedTeam = { ...existingTeam, ...updates }
    await kv.set(`team:${teamId}`, updatedTeam)
    
    return c.json({ success: true, team: updatedTeam })
  } catch (error) {
    console.error('Error updating team:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.delete('/make-server-e5b94f28/admin/team/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const teamId = c.req.param('id')
    
    // Delete team
    await kv.del(`team:${teamId}`)
    
    // Delete members
    const members = await kv.getByPrefix(`team_member:${teamId}:`)
    for (const member of members) {
      await kv.del(`team_member:${teamId}:${member.id}`)
    }
    
    // Delete results
    await kv.del(`results:${teamId}`)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== TEAM MEMBERS ==========

app.post('/make-server-e5b94f28/admin/team/:teamId/member', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const teamId = c.req.param('teamId')
    const { name, age, email, phone } = await c.req.json()
    
    const memberId = crypto.randomUUID()
    const member = {
      id: memberId,
      teamId,
      name,
      age: age || null,
      email: email || null,
      phone: phone || null
    }
    
    await kv.set(`team_member:${teamId}:${memberId}`, member)
    
    return c.json({ success: true, member })
  } catch (error) {
    console.error('Error adding team member:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.delete('/make-server-e5b94f28/admin/team/:teamId/member/:memberId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const teamId = c.req.param('teamId')
    const memberId = c.req.param('memberId')
    
    await kv.del(`team_member:${teamId}:${memberId}`)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== RESULTS ==========

app.get('/make-server-e5b94f28/results', async (c) => {
  try {
    const allResults = await kv.getByPrefix('results:')
    const teams = await kv.getByPrefix('team:')
    
    // Merge results with team info
    const leaderboard = allResults.map(result => {
      const team = teams.find(t => t.id === result.teamId)
      return {
        ...result,
        teamName: team?.name || 'Unknown',
        region: team?.region || '',
        status: team?.status || ''
      }
    })
    
    // Sort by total score descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore)
    
    return c.json({ results: leaderboard })
  } catch (error) {
    console.error('Error fetching results:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.put('/make-server-e5b94f28/admin/results/:teamId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const teamId = c.req.param('teamId')
    const { stage1, stage2, stage3 } = await c.req.json()
    
    const existingResults = await kv.get(`results:${teamId}`)
    if (!existingResults) {
      return c.json({ error: 'Nəticələr tapılmadı' }, 404)
    }
    
    // Update results
    const updatedResults = {
      teamId,
      stage1: stage1 || existingResults.stage1,
      stage2: stage2 || existingResults.stage2,
      stage3: stage3 || existingResults.stage3,
      totalScore: (stage1?.score || existingResults.stage1.score || 0) +
                  (stage2?.score || existingResults.stage2.score || 0) +
                  (stage3?.score || existingResults.stage3.score || 0)
    }
    
    await kv.set(`results:${teamId}`, updatedResults)
    
    return c.json({ success: true, results: updatedResults })
  } catch (error) {
    console.error('Error updating results:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== CONTACT MESSAGES ==========

app.post('/make-server-e5b94f28/contact', async (c) => {
  try {
    const { name, email, phone, message } = await c.req.json()
    
    if (!name || !email || !message) {
      return c.json({ error: 'Bütün məlumatları daxil edin' }, 400)
    }
    
    const messageId = crypto.randomUUID()
    const contactMessage = {
      id: messageId,
      name,
      email,
      phone: phone || '',
      message,
      createdAt: new Date().toISOString(),
      read: false
    }
    
    await kv.set(`message:${messageId}`, contactMessage)
    
    return c.json({ success: true, messageId })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.get('/make-server-e5b94f28/admin/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const messages = await kv.getByPrefix('message:')
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return c.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return c.json({ error: String(error) }, 500)
  }
})

app.put('/make-server-e5b94f28/admin/message/:id/read', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const messageId = c.req.param('id')
    const message = await kv.get(`message:${messageId}`)
    
    if (!message) {
      return c.json({ error: 'Mesaj tapılmadı' }, 404)
    }
    
    message.read = true
    await kv.set(`message:${messageId}`, message)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error marking message as read:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== LOGO UPLOAD ==========

app.post('/make-server-e5b94f28/admin/upload-logo', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'Fayl tapılmadı' }, 400)
    }
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const bucketName = 'make-e5b94f28-team-logos'
    
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false
      })
    
    if (error) {
      console.error('Upload error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Generate signed URL (valid for 1 year)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000)
    
    if (urlError) {
      console.error('Signed URL error:', urlError)
      return c.json({ error: urlError.message }, 400)
    }
    
    return c.json({ success: true, url: signedUrlData.signedUrl })
  } catch (error) {
    console.error('Upload exception:', error)
    return c.json({ error: String(error) }, 500)
  }
})

// ========== STATISTICS ==========

app.get('/make-server-e5b94f28/admin/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const teams = await kv.getByPrefix('team:')
    const messages = await kv.getByPrefix('message:')
    const results = await kv.getByPrefix('results:')
    
    const stats = {
      totalTeams: teams.length,
      totalMessages: messages.length,
      unreadMessages: messages.filter(m => !m.read).length,
      regionDistribution: teams.reduce((acc, team) => {
        acc[team.region] = (acc[team.region] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      statusDistribution: teams.reduce((acc, team) => {
        acc[team.status] = (acc[team.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      averageScore: results.length > 0
        ? results.reduce((sum, r) => sum + r.totalScore, 0) / results.length
        : 0
    }
    
    return c.json({ stats })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return c.json({ error: String(error) }, 500)
  }
})

Deno.serve(app.fetch)
