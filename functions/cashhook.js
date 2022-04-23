// authenticates you with the API standard library (stdlib.com)
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Parse application/x-www-form-urlencoded data to accessible JSON data
const data = JSON.parse(context.params.data);

// Verify that the message is genuine from Ko-Fi
if (data.verification_token === process.env.KOFI_TOKEN) {
  console.log(context.params.data);
  console.log(data.message_id);
  console.log(data.type);
  // Check that the incoming data is permitted to be publicised 
  if (data.is_public === true) {
    // Check if the incoming data is a subscription
    if (data.type === 'Subscription') {
      // Check if the incoming data is the first payment of a new subscription
      if (data.is_first_subscription_payment === true) {
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: process.env.DONATION_FLOW_CHANNEL,
          // The message content pre-embed delivered in Discord
          content: `**New Subscriber: ${data.from_name}**`,
          tts: false,
          embeds: [
            {
              type: 'rich',
              // The title of the embed delivered to Discord
              title: `New Monthly Subscriber: ${data.from_name}! 🤑`,
              // The description (content) of the embed delivered in Discord
              description: `${data.from_name} has just subscribed to ${data.tier_name} at ${data.amount} ${data.currency}/month!`,
              color: 0x3EC300,
            },
          ],
        });
        // Check if the incoming data is instead, not first payment of a new subscription
      } else if (data.is_first_subscription !== true){
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: process.env.DONATION_FLOW_CHANNEL,
          // The message content pre-embed delivered in Discord
          content: `**Continued Subscription: ${data.from_name}**`,
          tts: false,
          embeds: [
            {
              type: 'rich',
              // The title of the embed delivered to Discord
              title: `${data.from_name} has just continued their subscription! 💸`,
              description: `${data.from_name} has continued their subscription to ${data.tier_name} at ${data.amount} ${data.currency}/month!`,
              color: 0x3EC300,
            },
          ],
        });
      }
      // Check if the incoming data is a donation
    } if (data.type === 'Donation') {
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: process.env.DONATION_FLOW_CHANNEL,
        content: `**Donation from: ${data.from_name}**`,
        tts: false,
        embeds: [
          {
            type: 'rich',
            // The title of the embed delivered to Discord
            title: `New Donation from: ${data.from_name}! 💰`,
            // The description (content) of the embed delivered in Discord
            description: `${data.from_name} has just donated ${data.amount} ${data.currency}`,
            color: 0x3EC300,
          },
        ],
      });
      // Check if the incoming data is a shop order
    } if (data.type === 'Shop Order') {
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: process.env.DONATION_FLOW_CHANNEL,
        content: `**New Shop Order from: ${data.from_name}**`,
        tts: false,
        embeds: [
          {
            type: 'rich',
            // The title of the embed delivered to Discord
            title: `New Shop Order from: ${data.from_name}! 🛒`,
            // The description (content) of the embed delivered in Discord
            description: `${data.from_name} has just placed an order worth ${data.amount} ${data.currency} on our Ko-Fi shop!`,
            color: 0x3EC300,
          },
        ],
      });
    }
    // Send a privatised log in the console of non public donations
  } else if (data.is_public !== true){
    console.log('NOT PUBLIC : CANNOT BE SHARED')
  }
  // Send a privatised log in the console of incorrect Ko-Fi tokens
} else if (data.verification_token !== process.env.KO-FI_TOKEN){
  console.log('ERROR : INCORRECT VERIFICATION TOKEN')
}