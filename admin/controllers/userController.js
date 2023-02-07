var User = require("../models/userModel")

exports.getMenuList = async (req,res) => {
    var menuList = await User.getMenuList()
    if(menuList.length > 0){
        res.json(menuList);
    } else {
        res.json({
            status:'error',
            message:'No data found'
        })
    }
}