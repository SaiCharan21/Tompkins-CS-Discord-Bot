module.exports = (client) => {
    const channelId = '752648429041090710' // welcome channel
    const targetChannelId = '752296695982719057' // verify channel
  
    client.on('guildMemberAdd', (member) => {
      const message = `Welcome to the TompkinsCS club  Make sure you have this form filled out, once you have it filled out type :
          verify.
      Then you will have access to the rest of the server!
      This is the form link: https://forms.gle/NnzoXiXPhzNrT3HX8
      `
  
      const channel = member.guild.channels.cache.get(channelId)
      channel.send(message)
    })
  }