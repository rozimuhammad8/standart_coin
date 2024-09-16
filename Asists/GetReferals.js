const { Users } = require("../createTables");

async function GetReferals(TelegramID) {
  try {


    // Fetch referrals made by user1 (user2 and user3)
    const result = await Users.findOne({
      where: { id: TelegramID },
      include: { model: Users, as: 'Referal' }
    });

    return result.Referal, null, 2;

  } catch (error) {
    return error;
  }

}
module.exports = { GetReferals }