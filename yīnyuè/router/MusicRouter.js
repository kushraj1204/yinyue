const express=require('express');
const musicController=require('../controller/MusicController');
const router=express.Router();

router.get('/',musicController.getAllMusic);

router.get('/playlist',musicController.getMyMusic);
router.put('/:id/playlist/add',musicController.addToMyMusic);
router.delete('/:id/playlist/remove',musicController.removeFromMyMusic);


module.exports=router;