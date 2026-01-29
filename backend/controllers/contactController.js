import Contact from "../models/ContactMessage.js";

export const deleteMessage = async (req,res) =>{
    try{
        const {id }= req.params;
        
        const message = await Contact.findById(id);

        if(!message){
            return res.status(404).json({success:false, msg:"Message not found"});
        }

        await Contact.findByIdAndDelete(id);

        return res.status(200).json({success:true, msg:"Message deleted successfully"});

    } catch(error){
        console.error("DELETE MESSAGE ERROR:", error);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
};