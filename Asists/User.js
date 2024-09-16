const { Users } = require("../createTables");

async function UserCreate(TelegramID, ReferalCode) {
    try {
        var user = await Users.findOne({
            where: {
                token: TelegramID
            }
        })
        if (user == null) {
            var newUser = await Users.create({
                token: TelegramID,
                balance: 0,
                isVip: false,
                follow: ReferalCode
            })
                var ReferalUser = await Users.findOne({
                    where: {
                        token: ReferalCode
                    }
                })
                if (ReferalUser) {
                    if(ReferalUser.toJSON().isVip == true){
                        var arr = ReferalUser.toJSON().followers
                        var oldBalance = ReferalUser.toJSON().balance
                        arr.push(TelegramID)
                        Users.update(
                            {
                                followers: arr,
                            },
                            {
                                where: {token: ReferalCode}
                            }
                        )

                    }
                }
            
            return true
        } else {
            return false
        }
    } catch (e) {
        console.log(e)
        return null
    }
}


module.exports = { UserCreate }