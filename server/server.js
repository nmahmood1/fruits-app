// Modules
import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { writeFile } from 'fs'
import axios from 'axios'

// Data
import fruits from './fruits.json' assert {type: 'json'}

// Express configuration
const app = express()
      app.use(cors())
      app.use(express.json())

// ENV variables
dotenv.config()
const PORT = process.env.PORT

// GET routes
app.get('/fruits/', (req, res) => {
  res.send(fruits);
})

app.get('/rick-and-morty-characters', (req, res) => {
    axios.get('https://rickandmortyapi.com/api/character')
    .then(function (response) {
      // handle success
      return response
    })
    .then(function(data) {
        res.send(data.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
})

app.get('/fruits/:id', (req, res) => {
    const id = Number(req.params.id)
    let found = false

    try {
        // Found case
        // TO DO: If array becomes too large, potential CPU usage problem here
        for(let i = 0; i < fruits.length; i++) {
            if (fruits[i].id === id) {
                found = true
                res.status(200)
                res.send(fruits[i])
                break;
            }
        }
        // Not found case
        if (!found) {
            throw new Error(
                `Fruit with id ${id} does not exist`
            )
        }
    } catch(error) {
        res.status(404)
        res.send({
            status: 404,
            message: error.message
        })
    }
})

// POST routes

// TO DO: Add condition to not allow for duplicated
app.post('/fruits', (req, res) => {
    try {
        // Create new fruit object
        const newFruit = {
            // generate id
            id: fruits.length + 1,
            name: req.body.name,
            color: req.body.color,
            // set readyToEat
            readyToEat: false
        }

        // Add the new fruit to the JSON file
        fruits.push(newFruit)

        // write to json
        writeFile('fruits.json', JSON.stringify(fruits), (error) => {
            if (error) {
                throw new Error(`unable to write to JSON`)
            } 

            res.status(200)
            res.send({
                status: 200,
                message: 'Successfully written to JSON'
            })
        })
    } catch (error) {
        res.status(400)
        res.send({
            status: 400,
            message: error.message || 'Bad request'
        })
    }
})


// PUT routes
app.put('fruits/eat/:name', (req, res) => {
    try {
        const fruitName = req.params.name
        // Get fruit with name from JSON
        // .find(element => element > 10);
        fruits.find((fruit) => {
            // If the fruit exists, eat it
            if (fruit.name === fruitName && fruit.readyToEat) {
                // Update with payload revieved
                fruit.eaten = true
            }
            else {
                throw new Error(`The fruit doesn't exist, or it was already eaten`)
            }

            // Update the JSON
            writeFile('fruits.json', JSON.stringify(fruits), (error) => {
                if (error) {
                    throw new Error(`unable to write to JSON`)
                } 
    
                res.status(200)
                res.send({
                    status: 200,
                    message: 'Successfully written to JSON'
                })
            })
        })

    } catch (error) {
        res.status(422)
        res.send({
            status: 422,
            message: error.message || 'Bad request'
        })
    }
})

// DELETE routes
app.delete('/fruits', (req, res) => {
    const fruitName = req.body.name

    try {
        // Find fruit and remove from JSON
        fruits.forEach((fruit, index) => {
            if(fruit.name === fruitName) {
                fruits.splice(index, 1)
    
                writeFile('fruits.json', JSON.stringify(fruits), (error) => {
                    if (error) {
                        throw new Error(`unable to write to JSON`)
                    } 
        
                    res.status(200)
                    res.send({
                        status: 200,
                        message: 'Successfully deleted fruit'
                    })
                })
            }
        })
    } catch (error) {
        res.status(404)
        res.send({
            status: 404,
            message: error.message || 'Bad request'
        })
    }
})


app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}`)
})



// const express = require('express');
// const app = express();
// require('dotenv').config();
// const port = process.env.PORT;

// const fruits = [
//   {
  
//     name: 'apple',
//     color: 'red',
//     readyToEat: true,
//   },
//   {
//     name: 'pear',
//     color: 'green',
//     readyToEat: false,
//   },
//   {
//     name: 'banana',
//     color: 'yellow',
//     readyToEat: true,
//   },
// ];

// app.get('/fruits/', (req, res) => {
//   res.send(fruits);
// });

// app.get('/fruits/:index', (req, res) => {
//   const index = req.params.id

//   try {
//       if (fruits[id]) {
//           res.status(200)
//           res.send(fruits[index])
//       }
//       else {
//           throw new Error(
//               `Fruit at index ${index} does not exist`
//           )
//       }
//   } catch(error) {
//       res.status(404)
//       res.send({
//           status: 404,
//           message: error.message
//       })
//   }
// })


// app.listen(port, () => {
//   console.log(`Express is listening on port ${port}`);
// });

