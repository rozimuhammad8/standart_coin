const { Users } = require("../createTables")

async function vipReferalsLength(arr){
    var Data = 0
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        var user = await Users.findOne({
            where: {
                token: element
            }
        })
        if(user.toJSON().isVip == true){
            Data++
        }
        
    }
    return Data
}

async function MainMsg(chatId) {
    var user = await Users.findOne({
        where: {
            token: chatId
        }
    })
    return user.toJSON().isVip ?
        `Hisobingiz: ${user.toJSON().balance} SCOIN
referalaringiz soni: ${user.toJSON().followers.length}
VIP referalaringiz soni: ${(await vipReferalsLength(user.toJSON().followers))}
Har bir yangi VIP referal uchun taqdim etiladigon SCOIN: 15 000
Status: VIP
referal kodingiz: https://t.me/standartcoin_bot?start=${chatId}`
        :
        `Hisobingiz: 0 SCOIN
Status: NEW
VIP status narxi: 30 000uzs
VIP Status olish: /getvip`
}

module.exports = { MainMsg }