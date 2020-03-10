const express = require('express');
const Hubs = require("../data/db.js");
const server = express()
const router = express.Router();

router.get('/', (req, res) => {
    Hubs.find(req.query)
    .then(hubs => {
        res.status(200).json(hubs)
    })
    .catch(error => {
        console.log("error", error);
        res.status(500).json({
            message: "Error retrieving the array of posts"
        });
    })
})

router.get(`/:id`, (req, res) => {
    
    const { id } = req.params

    Hubs.findById(id)
    .then(post => {
        if(post.length > 0){
            res.status(200).json(post)
        } else {
            res.status(404).json({
                error: "The post with the specified id doesn't exist"
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: "the comments info could not be retrieved"
        })
    })
    
    // const findIt = Hubs.find();
    // if (!findIt) {
    //     return status(500).json({
    //         message: "There was an error while getting the post"
    //     })
    // } else {
    // Hubs.findById(req.params.id)
    // .then(hub => {
    //     if (hub) {
    //         res.status(200).json(hub)
    //     } else {
    //         res.status(404).json({ message: "Post not found"})
    //     }
    // })
    // .catch(error => {
    //     console.log("error getting specific post", error)
    //     res.status(500).json({
    //         message: "Error retrieving the specific post"
    //     })
    // })}
})

//UNSURE BELOW
router.post(`/:id/comments`, (req, res) => {
    const data = req.body;
    const { id } = req.params;

        Hubs.findById(id)
        .then(post => {

            if (!post.length){
                res.status(404).json({
                    message: "the post with the specified ID does not exist"
                })
            } else if (!data.text){
                res.status(400).json({
                    errorMessage: "Please provide text for the comment"
                })
            } else if (data.text){
                Hubs.insertComment(data)
                .then(comment => {
                    res.status(201).json(data.text)
                })
                .catch( err => {
                    console.log("error inserting comment", err)
                    res.status(500).json({
                        error: "error"
                    })
                })
            }
        })
})
/////////////////


router.post(`/`, (req, res) => {
    Hubs.insert(req.body)
    .then( hub => {
        res.status(201).json(hub)
    })
    .catch(error => {
        console.log("error", error)
        res.status(500).json({
            message: "Error adding the post"
        })
    })
})

// UNSURE BELOW
router.get(`/:id/comments`, (req, res) => {

    const { id } = req.params;
    const data = req.body;

    Hubs.findById(id).then(post => {
        if(!post.length){
            res.status(404).json({
                message: "The post with the specified ID was not found"
            })
        } else if (post.length){
            Hubs.findPostComments(id)
            .then(comment => {
                if (!comment.length){
                    res.status(500).json({
                        error: "comment info could not be retrieved"
                    })
                } else if (comment.length){
                    res.status(200).json(comment);
                }
            })
        }
    })

})
/////////////////


router.delete(`/:id`, (req, res) => {

    const { id } = req.params;

    Hubs.findById(id).then(post => {
        if (!post.length) {
            res.status(404).json({
                error: "error post not found"
            })
        } else if (post.length) {
            Hubs.remove(id)
            .then(elem => {
                res.status(200).json(post);
            })
            .catch(err => {
                res.status(500).json({
                    error: "the post delete had an error"
                })
            })
        }
    })
})

router.put(`/:id`, (req, res) => {
    
    const { id } = req.params
    const data = req.body;     
    
    Hubs.findById(id)
    .then(post => {
        if (!post.length){
            res.status(404).json({
                message: ""
            })
        } else if (post.length){
            if (!data.title || !data.contents){
                res.status(400).json({
                    errorMessage: "The post with the specified ID does not exist"
                })
            } else if (data.title && data.contents) {
                Hubs.update(id, data)
                .then(update => {
                    res.status(200).json(data)
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: "The post info could not be modified"
                    })
                })
            }
        }
    })
    
    // const changes = req.body;
    // Hubs.update(req.params.id, changes)
    // .then(hub => {
    //     if (hub) { 
    //         res.status(200).json(hub)
    //     } else {
    //         res.status(404).json({
    //             message: "The post couldn't be found"
    //         })
    //     }
    // })
    // .catch(error => {
    //     console.log(error);
    //     res.status(500).json({
    //         message: "Error updating the post"
    //     })
    // })
})


module.exports = router;