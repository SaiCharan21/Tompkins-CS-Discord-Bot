const Discord = require("discord.js");
const config = require("./config.json");
const db = require('./db');

const allowedChannels = ["verify", "bot-commands"];

const verifedName = "Members";
const NotVerifedName = "NotVerified";

const defaultChannelName = "verify";

const client = new Discord.Client();

const checkGuildsVerifed = () => {
    client.guilds.cache.forEach(guild => {
        // console.log(guild.name + "\n");
        guild.members.cache.forEach(member => {
            // console.log(member.nickname || );
            db.checkByName(member.nickname, (isMember, memberName) => {
                VerifiedRole = guild.roles.cache.find(
                    (r) => r.name === verifedName
                );
                
                var isVerified = false;

                member.roles.cache.forEach(m => {
                    if(m.name === verifedName){
                        isVerified = true;
                    }
                })
                
                if(isMember)
                    verify(member, memberName, guild, null);
                else if(!isVerified)
                    unverify(member, guild, null);
            })
        })
    });
}

const verify = (user, memberName, guild, sentChannel) => {
    var channel = sentChannel;

    //console.log(channel);
    // if(sentChannel){
        // channel = sentChannel;
    // }


    console.log("User " + memberName + " verified! Adding roles & changing nickname...")
    VerifiedRole = user.guild.roles.cache.find(
        (r) => r.name === verifedName
    );
    user.roles.add(VerifiedRole);
    user.setNickname(memberName).catch(e => {
        console.log(`Couldn't change nickname for ${memberName}, most likely because they are an administrator!`)
    });

    NotVerifiedRole = user.guild.roles.cache.find(
        (r) => r.name === NotVerifedName
    );
    user.roles.remove(NotVerifiedRole);

    // if (channel.name !== defaultChannelName)
    //     channel.send("```"+ memberName + " has been verified!" + "```");
};

const unverify = (user, guild, sentChannel) => {
    
    // var channel = guild.channels.cache.get("name",defaultChannelName);

    // if(sentChannel){
    //     channel = sentChannel;
    // }

    console.log("User " + user.user.username + " unverified! Setting roles...")

    VerifiedRole = user.guild.roles.cache.find(
        (r) => r.name === verifedName
    );
    UnverifiedRole = user.guild.roles.cache.find(
        (r) => r.name === NotVerifedName
    );

        

    user.roles.remove(VerifiedRole);
    user.roles.add(UnverifiedRole);

    // if (channel)    
    //     channel.send("```Unverified " + user.user.username+"```");
}

const noPermsMessage = (channel) => {
    channel.send("```"+'You do not have the permissions to run this command!'+ "```");
}

client.on("ready", () => {

    console.log(`Bot has started....`);
    client.user.setActivity(`Computer Science`);

    checkGuildsVerifed();
});

client.on("guildMemberAdd", (member) => {
    
    member.send(
        "**Welcome to the Tompkins Computer Science Server!**" + "\n" +
        "To get access to the whole server you will need to fill out the following form:" + "\n"+
        "https://forms.gle/NnzoXiXPhzNrT3HX8"+ "\n"+
        "Once the form is filled out go to the #verify channel and type"+"\n"+
        "```?verify <studentid>```" + "\n" + 
        "This will give you access to the whole server!!!"
    );

    UnverifiedRole = member.guild.roles.cache.find(
        (r) => r.name === NotVerifedName
    );
    member.roles.add(UnverifiedRole);
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

    let channel = message.channel;

    let allowed = false;

    for(var i=0; i < allowedChannels.length; i++){
        if(channel.name == allowedChannels[i]){
            allowed = true;
            break;
        }
    }

    if(!allowed){
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
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    message.channel.send("Restarting...").then((m) => {
                        client.destroy().then(() => {
                            nop;
                            client.login("token");
                        });
                    });
                }
                else{
                    noPermsMessage(message.channel);
                }
                break;
            }
            case "shutdown": {
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    message.channel.send("```Shutting down...```").then((m) => {
                        client.destroy();
                    });
                }
                else{
                    noPermsMessage(message.channel);
                }
                break;
            }
            case "verify": {
                message.delete({"timeout": 60000});
                if (params.length != 1 || params[0].length != 8) {
                    console.log("\nVerification message has a syntax error!")
                    var botMsg = message.channel.send(
                        "The right format for this command is" +
                        "\n" +
                        "```" +
                        "\n" +
                        "?verify <STUDENT ID>" +
                        "\n" +
                        "```" +
                        "Make sure your 8-character student ID was typed correctly"
                    );
                    
                    (await botMsg).delete({"timeout": 60000});

                    break;
                }

                console.log("\nAttempting verification...")
                db.checkForMember(params[0], async (isMember, memberName) => {
                    if (isMember) {
                        verify(message.member, memberName, message.guild,message.channel);
                    } else {
                        console.log("```User was not verified! Sending google form link...```");
                        var botMsg = message.channel.send("```Looks like you haven't signed up for the team! Join here: https://forms.gle/NnzoXiXPhzNrT3HX8```");
                        (await botMsg).delete({"timeout": 60000});
                    }
                })
                break;
            }
            case "unverify": {
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    if (params.length == 0) {
                        unverify(message.member, message.guild, message.channel);
                    }
                    else if (params.length == 1) {
                        const userID = params[0].substring(3, params[0].length - 1);
                        console.log(userID);
                        target = message.guild.members.cache.get(userID);
                        if(target)
                            unverify(target, message.guild, message.channel);
                        else 
                            message.channel.send("```Member not found!```");
                    }
                } else{
                    noPermsMessage(message.channel);
                }

                break;
            }
            case "verifyguilds": {
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    checkGuildsVerifed();
                }
                else{
                    noPermsMessage(message.channel);
                }
            }
            default: {
                console.log(`\n\`\`\`Unknown command "${command}" ! Sending error message...\`\`\``)
                message.channel.send(`\`\`\`"?${command}" is not a known command\`\`\``)
            }
        }
    }
});


const createRole = (guild) => {
    guild.roles.find("name", verifedName);
    guild.roles.find("name", NotVerifedName);
};

const updateMember = (message) => {};

const deleteMember = (message) => {};

const updateMembers = (guild) => {};

client.login(config.token);