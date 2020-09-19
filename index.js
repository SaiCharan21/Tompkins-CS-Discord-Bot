const Discord = require("discord.js");
const config = require("./config.json");
const db = require('./db');

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Bot has started....`);
    client.user.setActivity(`Computer Science`);

    const guilds = client.guilds;
    // console.log(guilds.length);

    for (var i = 0; i < guilds.length; i++) {
        const guild = guilds[i];
        const members = guild.members;
        console.log(guild.name + "\n\n");
        for (var j = 0; j < members.length; j++) {
            member = members[j];
            console.log(member.name);
            notVerifiedRole = member.guild.roles.cache.find(
                (r) => r.name === "NotVerified"
            );
            member.roles.add(notVerifiedRole);

            verifiedRole = member.guild.roles.cache.find((r) => r.name === "Verified");
            member.roles.remove(verifiedRole.id);
        }
    }
});

client.on("guildMemberAdd", (member) => {
    // notVerified = member.guild.roles.find("name", "Not Verified");
    // member.addRole(notVerified);

    //https://forms.gle/NnzoXiXPhzNrT3HX8
});

client.on("message", async (message) => {
    if (
        message.author.bot ||
        message.content.charAt(0) != "?" ||
        message.content.length < 1
    ) {
        return;
    }

    const textContent = message.content
    const split = message.content.toLowerCase().substring(1).split(/[ ,]+/);
    const command = split[0]
    const params = split.splice(1)

    //let role = message.guild.roles.find(r => r.name === "Verified");

    // if (textContent == "verify") {
    //     //console.log(message.guild.roles)
    //     verifiedRole = message.guild.roles.cache.find((r) => r.name === "Verified");
    //     message.member.roles.add(verifiedRole);
    // }

    //const command = textContent.split(" ")[0].split("?")[1];

    if (textContent) {
        console.log("\n-----------------------------------------------")
        console.log(`\nMessage Recieved: ${textContent}`);
        console.log("COMMAND: " + command);
        console.log("PARAMS: " + JSON.stringify(params))

        switch (command) {
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
                if (params.length != 1 || params[0].length != 8) {
                    console.log("\nVerification message has a syntax error!")
                    message.channel.send(
                        "The right format for this command is" +
                        "\n" +
                        "```" +
                        "\n" +
                        "?verify <STUDENT ID>" +
                        "\n" +
                        "```" +
                        "Make sure your 8-character student ID was typed correctly"
                    );
                    break;
                }

                console.log("\nAttempting verification...")
                db.checkForMember(params[0], (isMember, memberName) => {
                    if (isMember) {
                        console.log("User " + memberName + " verified! Adding roles & changing nickname...")
                        VerifiedRole = message.guild.roles.cache.find(
                            (r) => r.name === "Verified"
                        );
                        message.member.roles.add(VerifiedRole);
                        message.member.setNickname(memberName);
                        message.channel.send(memberName + " has been verified!");
                    } else {
                        console.log("User was not verified! Sending google form link...")
                        message.channel.send("Looks like you haven't signed up for the team! Join here: https://forms.gle/NnzoXiXPhzNrT3HX8")
                    }
                })
                break;
            }
            default: {
                console.log(`\nUnknown command "${command}" ! Sending error message...`)
                message.channel.send(`"?${command}" is not a known command`)
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
    guild.roles.find("name", "Verified");
    guild.roles.find("name", "Not-Verified");
};

const updateMember = (message) => { };

const deleteMember = (message) => { };

const updateMembers = (guild) => { };

client.login(config.token);