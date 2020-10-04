const Discord = require("discord.js");
const config = require("./config.json");
const db = require('./db');

const client = new Discord.Client();

const checkGuildsVerifed = () => {
    client.guilds.cache.forEach(guild => {
        // console.log(guild.name + "\n");
        guild.members.cache.forEach(member => {
            // console.log(member.nickname || );
            db.checkByName(member.nickname, (isMember, memberName) => {
                if (isMember) {
                    verify(member, memberName);
                } else {
                    unverify(member);
                }
            })
        })
    });
}

const verify = (user, memberName, channel) => {
    console.log("User " + memberName + " verified! Adding roles & changing nickname...")
    VerifiedRole = user.guild.roles.cache.find(
        (r) => r.name === "Verified"
    );
    user.roles.add(VerifiedRole);
    user.setNickname(memberName);
    if (channel)
        channel.send(memberName + " has been verified!");
};

const unverify = (user, channel) => {
    console.log("User unverified! Setting roles...")

    VerifiedRole = user.guild.roles.cache.find(
        (r) => r.name === "Verified"
    );
    UnverifiedRole = user.guild.roles.cache.find(
        (r) => r.name === "NotVerified"
    );
    user.roles.remove(VerifiedRole);
    user.roles.add(UnverifiedRole);

    if (channel)
        channel.send("Unverified " + user.user.name);
}

client.on("ready", () => {
    console.log(`Bot has started....`);
    client.user.setActivity(`Computer Science`);

    checkGuildsVerifed()
});

client.on("guildMemberAdd", (member) => {
    // notVerified = member.guild.roles.find("name", "Not Verified");
    // member.addRole(notVerified);

    //https://forms.gle/NnzoXiXPhzNrT3HX8
});

client.on("message", async (message) => {
    if (
        message.author.bot ||
        (message.content.charAt(0) != "?") ||
        message.content.length < 1
    ) {
        return;
    }

    const textContent = message.content
    const split = message.content.toLowerCase().substring(1).split(/[ ,]+/);
    const command = split[0]
    const params = split.splice(1)

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
                        verify(message.member, memberName, message.channel);
                    } else {
                        console.log("User was not verified! Sending google form link...")
                        message.channel.send("Looks like you haven't signed up for the team! Join here: https://forms.gle/NnzoXiXPhzNrT3HX8")
                    }
                })
                break;
            }
            case "unverify": {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    if (params.length == 0) {
                        unverify(message.member);
                    }
                    else if (params.length == 1) {
                        const userID = params.substring(3, params.length - 1);

                        message.guild.fetchMember(userID).then(member => {
                            // Got the member!
                            unverify(member, null);
                        }).catch(() => {
                            // Error, member not found
                            message.channel.send('Could not find a member with the given ID or mention!');
                        });

                    }


                }

                break;
            }
            case "verifyguilds": {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    checkGuildsVerifed();
                }
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