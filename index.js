const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const welcome = require('./welcome')

client.on("ready", () => {
  console.log(`Bot has started.`);
  welcome(client)
  client.user.setActivity(`Computer Science`);

  const guilds = client.guilds;

  for (var i = 0; i < guilds.length; i++) {
    const guild = guilds[i];

    const members = guild.members;

    for (var j = 0; j < members.length; j++) {
      notVerifedRole = message.guild.roles.cache.find(r => r.name === "NotVerifed");
      message.member.roles.add(notVerifiedRole);
    }
  }
});

client.on("guildMemberAdd", (member) => {
  // notVerifed = member.guild.roles.find("name", "Not Verifed");
  // member.addRole(notVerifed);

  member.send(
    "Welcome to the TompkinsCS club " +
      member.name +
      ".\n" +
      "Make sure you have this form filled out, once you have it filled out type" +
      "\n" +
      '"Verify"' +
      "\n" +
      "Then you will have access to the rest of the server!" +
      "\n" +
      "\n\nThis is the form link" +
      "\n" +
      "https://forms.gle/NnzoXiXPhzNrT3HX8"
  );

  //https://forms.gle/NnzoXiXPhzNrT3HX8
});

client.on("message", async (message) => {
  if (message.author.bot && message.channel.name != "verify") return;

  const textContent = message.content;
  console.log(`Message Recieved: ${textContent}`);

  //let role = message.guild.roles.find(r => r.name === "Verifed");

  if (textContent == "verify") {
    //console.log(message.guild.roles)
    verifedRole = message.guild.roles.cache.find(r => r.name === "Verifed");
    message.member.roles.add(verifedRole);
  }

  const command = textContent.split(" ")[0].split("?")[1];
  if (command) {
    console.log("COMMAND:" + command);
    switch (command) {
      case "restart": {
        message.channel.send("Restarting...").then((m) => {
          client.destroy().then(() => {
            client.login("token");
          });
        });
        break;
      }
      case "shutdown": {
        message.channel.send("Shutting down...").then((m) => {
          client.destroy();
        });
        break;
      }
    }
  }
});

const authorized = (user) => {
  authorized_users = [
    "312736226375630849",
    "324257645408288779",
    "599078674892849175",
    "613510923239555082"
  ];
  return authorized_users.includes(user);
};

const createRole = (guild) => {
  guild.roles.find("name", "Verifed");
  guild.roles.find("name", "Not-Verifed");
};

const updateMember = (message) => {};

const deleteMember = (message) => {};

const updateMembers = (guild) => {};

client.login(config.token);
