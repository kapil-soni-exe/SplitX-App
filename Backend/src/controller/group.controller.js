const Group= require("../models/group.model")
const cryto = require("crypto")


//Create Group 
const generateInviteCode=()=>{
    return cryto.randomBytes(4).toString("hex");
}

const createGroup= async (req,res)=>{
     try{
        const {name}= req.body
        if(!name){
            return res.status(400).json({
        success: false,
        message: "Group name is required",
        });
        }

        // TEMP until auth comes in
    const createdBy = req.body.userId;

    if (!createdBy) {
      return res.status(400).json({
        success: false,
        message: "creator userId required",
      });
    }

    let inviteCode;
    let exists = true;

    // ensure uniqueness
    while (exists) {
      inviteCode = generateInviteCode();
      const found = await Group.findOne({ inviteCode });
      exists = !!found;
    }
    const group = await Group.create({
      name,
      createdBy,
      members: [createdBy],
      inviteCode,
    });

    res.status(201).json({
      success: true,
      data: {
        id: group._id,
        name: group.name,
        inviteCode: group.inviteCode,
      },
    });
     } catch(error){
        console.error("Create group error:", error);

     res.status(500).json({
      success: false,
      message: "Failed to create group",
    });
     }
}

// Fetch Group
const getAllgroup = async (req,res)=>{
  try{
    const groups = await Group.find()
    .populate("members","name email avtar")
    .populate("createdBy", "name email")
    
     res.status(200).json({
      success: true,
      data: groups,
    });

  }catch(err) {
    console.error("Fetch groups error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch groups"
  })
}
}


module.exports = {
  createGroup,getAllgroup
};