const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_ice_cream_db')
const app = express()
const PORT = 3000;

client.connect()

app.use(express.json())



//get all flavors
app.get('/api/flavors', async(req, res, next) =>{
try{
    const getflavors= await client.query(`
        SELECT * FROM flavor;`);
    console.log(getflavors.rows);
    res.status(201).json(getflavors.rows);
}catch(err){
    console.error('Error fetching flavors',err);
}
})
//get single flavor
app.get('/api/flavors/:id', async(req, res, next)=>{
    const { id }= req.params;
    try{
        const getflavor= await client.query(`
            SELECT * FROM flavor
            WHERE id=$1`,[id]);
        res.status(201).json(getflavor.rows);
    }catch(err){ 
        console.error('Error fetching single flavor', err);
    }
})
//post flavor details
app.post('/api/flavors', async(req, res, next)=>{
    try{
        const postflavors = await client.query(`
            INSERT into flavor(name)
            VALUES ($1)
            RETURNING *
            `,[req.body.name]);
        res.send(postflavors.rows[0]);
    }catch(err){
        console.error('Error at Post Flavor',err);
    }
})
//delete flavor
app.delete('/api/flavors/:id', async(req, res, next)=>{
    try{
        const deleteflavors = await client.query(`
            DELETE from flavor where id=$1`,
        [req.params.id]);
        res.sendStatus(204);
    }catch(err){
        console.error('Error deleting flavor',err);
    }
})
// PUT: update flavors
app.put('/api/flavors/:id', async(req, res, next)=>{
    try{
        const updateflavors = await client.query(`
            UPDATE flavor set is_favorite=$1,
            updated_at=now() 
            where id=$2
            RETURNING *`,[req.body.is_favorite, req.params.id]);
            res.send(updateflavors.rows[0]);
    }catch(err){
        console.error('Error updating favorite flavor')
    }
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});

// const init = async () => {
//     await client.connect();
//     console.log('connected to database');
//     let SQL = ``;
//     await client.query(SQL);
//     console.log('tables created');
//     SQL = ` `;
//     await client.query(SQL);
//     console.log('data seeded');
//   };
  
//   init();
