import mongoose from "mongoose";

import React from 'react'

async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully')
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection failed.' + err)
        })
    }
    catch (err) {
        console.error(err)
    }
}

export default connect