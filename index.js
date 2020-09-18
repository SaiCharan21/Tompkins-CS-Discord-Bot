const Discord = require("discord.js");
const config = require("./config.json");
const mysql = require("mysql2/promise");

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Bot has started.`);
  client.user.setActivity(`Computer Science`);

  const guilds = client.guilds;
  console.log(guilds.length);

  for (var i = 0; i < guilds.length; i++) {
    const guild = guilds[i];

    const members = guild.members;
    console.log(guild.name + "\n\n");
    for (var j = 0; j < members.length; j++) {
      member = members[j];
      console.log(member.name);
      notVerifedRole = member.guild.roles.cache.find(
        (r) => r.name === "NotVerifed"
      );
      member.roles.add(notVerifiedRole);

      verifedRole = member.guild.roles.cache.find((r) => r.name === "Verifed");
      member.roles.remove(verifedRole.id);
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
  if (
    message.author.bot ||
    message.content.charAt(0) != "?" ||
    message.content.length < 1
  )
    return;

  const textContent = message.content.toLowerCase().substring(1).split(" ");
  console.log(`Message Recieved: ${textContent}`);

  //let role = message.guild.roles.find(r => r.name === "Verifed");

  if (textContent == "verify") {
    //console.log(message.guild.roles)
    verifedRole = message.guild.roles.cache.find((r) => r.name === "Verifed");
    message.member.roles.add(verifedRole);
  }

  //const command = textContent.split(" ")[0].split("?")[1];
  if (textContent) {
    console.log("COMMAND:" + textContent.toString());
    switch (textContent[0]) {
      case "restart": {
        message.channel.send("Restarting...").then((m) => {
          client.destroy().then(() => {
            nop;
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
      case "verify": {
        if (textContent.length < 2 || textContent[1].length != 8) {
          message.channel.send(
            "The right format for this command is" +
              "\n" +
              "```" +
              "\n" +
              "?verify <STUDENT ID>" +
              "\n" +
              "```" +
              "\n" +
              "Make sure your id was typed correctly"
          );
          break;
        }

        const ismember = await isMember(textContent[1]);
        console.log("done")
        message.channel.send(
          "User " + textContent[1] + " is member is:" + ismember
        );

        if (ismember) {
          VerifedRole = message.guild.roles.cache.find(
            (r) => r.name === "Verifed"
          );
          message.member.roles.add(VerifedRole);
        }

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
    "613510923239555082",
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

//DB Functions
const isMember = async (id) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tompkinscs",
  });

  returnVal = undefined;

  await connection.query(
    "SELECT * FROM members WHERE student_id = ?",
    [id.toUpperCase()],
    async (err, res, field) => {
      if (err) throw err;
      returnVal = (res[0] && res[0].student_id)
      console.log(returnVal)
      return returnVal
    }
  );
};
