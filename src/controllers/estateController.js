const pool = require('../db')

exports.getEstate = async (req, res) => {
    //get estate from user

    const userId = req.user.id

    const result = await pool.query(`SELECT * FROM estates WHERE user_id = $1 AND is_active = TRUE`, [userId])
    
    res.status(200).json({
        status: 'success',
        data: {
            estate: result.rows
        }
    })
    
}

exports.createEstate = async (req, res) => {
    //create estate for user
    try {
        const userId = req.user.id
        const estate = req.body

        console.log("Req body: ", req.body);
        
        console.log("Estate from fe: ", estate);
        

        
    
        const heartbeat_frequency = [
            '3 month',
            '6 month',
            '12 month'
        ]
        
        //TODO: Calculate next_heartbeat_due_at based on heartbeat_frequency and last_heartbeat_at
        const result = await pool.query(`INSERT into estates 
            (user_id, estate_name, primary_contact_email, emergency_contact_name, emergency_contact_email, 
            emergency_contact_phone, heartbeat_frequency, grace_period_days, last_heartbeat_at, 
            next_heartbeat_due_at, require_mfa, high_value_threshold, waiting_period_days) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, 
            [userId, estate.name, estate.primaryEmail, estate.emergencyContact.name, 
            estate.emergencyContact.email, estate.emergencyContact.phone, estate.heartbeat.frequency, 
            estate.heartbeat.gracePeriod, estate.heartbeat.lastCheckin, estate.heartbeat.nextDeadline, estate.security.requireMFA, 
            estate.security.highValueThreshold, estate.security.waitingPeriod])

        const resultEstate = result.rows[0];
        console.log("Result: ", result);
        
        //insert all reminder schedules for the estate
        for (const schedule of estate.heartbeat.reminders) {
            await pool.query(
                `INSERT INTO estate_reminder_schedules (estate_id, schedule) VALUES ($1, $2)`, 
                [resultEstate.id, schedule]
            )
        }
        //const reminderResult = await pool.query(`INSERT INTO estate_reminder_schedules (estate_id, schedule) VALUES ($1, $2)`, [resultEstate.id, estate.reminder_schedule])
        
        //get all the reminder schedules for the estate
        const reminderResult = await pool.query(`SELECT * FROM estate_reminder_schedules WHERE estate_id = $1`, [resultEstate.id])
        const reminders = reminderResult.rows.map(row => row.schedule);


        //TODO: Logic for trusted contacts insert and get




        const Estate = {
            id: resultEstate.id,
            userId: resultEstate.user_id,
            name: resultEstate.estate_name,
            primaryEmail: resultEstate.primary_contact_email,
            emergencyContact: {
                name: resultEstate.emergency_contact_name,
                email: resultEstate.emergency_contact_email,
                phone: resultEstate.emergency_contact_phone,
            },
            heartbeat: {
                frequency: resultEstate.heartbeat_frequency, // months
                gracePeriod: resultEstate.grace_period_days, // days
                reminders, // reminder_schedule[],
                lastCheckin: resultEstate.last_heartbeat_at,
                nextDeadline: resultEstate.next_heartbeat_due_at,
            },
            security: {
                requireMFA: resultEstate.require_mfa,
                highValueThreshold: resultEstate.high_value_threshold,
                waitingPeriod: resultEstate.waiting_period_days, // days
                trustedContacts: [],
            },
            wallets: [],
            beneficiaries: [],
            status: 'active',
            createdAt: resultEstate.created_at,
            updatedAt: resultEstate.updated_at,
        }

        res.status(201).json({
            status: 'success',
            data: Estate
        })
        
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal server error")
    }
}