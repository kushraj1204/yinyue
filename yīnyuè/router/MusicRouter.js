const express=require('express');
const musicController=require('../controller/MusicController');
const router=express.Router();

router.get('/',musicController.getAllMusic);

router.get('/playlist',musicController.getMyMusic);
router.post('/playlist/add',musicController.addToMyMusic);
router.post('/playlist/remove',musicController.removeFromMyMusic);


module.exports=router;