const Discord = require('discord.js');
const Client = new Discord.Client();


var fs = require('fs');
var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var sv = JSON.parse(fs.readFileSync('Storage/servers.json', 'utf8'));
var Items = JSON.parse(fs.readFileSync('Storage/Items.json', 'utf8'));
var prefix = "!";
var servers = ['411813616489332736','417215656698839064','369924373056061450'];

var test_channels = ['412325321745104896','413488632062803969'];

var lumi_channels = [
    '419208265541484554',
    '419274795729813506',
    '417216482808954911',
    '419001267176865792',
    '417215657583706114',
    '418998753454981120',
    '420810468723261442',
    '418998786388393985',
    '418998814398087169',
    '420752579908206592'
];

var tiny_channels = ['369924373056061452','369925917339942912'];

var admins = ['183008488610332672','131470460763242496','89678077327589376'];
//lumi, manu
var isControlled = false;
var remote_user = '';
var remote_server = '411813616489332736';
var remote_channel = '413488632062803969';

Client.on('ready', () =>{
    console.log('Bot is online');
    Client.user.setPresence({status: 'online', game: {name: 'Team Fortress 2'}});
});

Client.on('message', message =>{
    let sender = message.author;
    let msg = message.content.trim().toUpperCase();

    if(!sender.bot){
        let args = msg.slice(prefix.length).split(/ +/);

        if(msg.startsWith(prefix+'PING')){
            return message.channel.send('<:Tinythinking:406456350152065035>');
        }


        /*~~~~~~~~~~~~~~~~~~~~~~~~MOD COMMANDS~~~~~~~~~~~~~~~~~~~~~~~~*/


        if(msg.startsWith(prefix+'LUMICREATEDAT') && (sender.id === admins[0] || sender.id === admins[1])){           //Create new data for user
            
            if(!args || args.length < 2) return;

            if(!userData[args[1]]){
                userData[args[1]] = {
                    name: message.guild.members.get(args[1]).user.username,
                    size: 'normal',
                    noms: 0,
                    eaten: 0
                }
                fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) =>{
                    if(err) console.error(err);
                })
                return console.log('User created.')
            }
            else return console.log('User already created.');
        }

        if(msg.startsWith(prefix+'LUMIEDITDAT') && (sender.id === admins[0] || sender.id === admins[1])){

            if(!args || args.length < 4) return;

            if(!userData[args[1]]) return console.log('User has not been created yet.');

        }

        if(msg.startsWith(prefix + 'CONTROL') && (sender.id === admins[0] || sender.id === admins[1] || sender.id === admins[2])){                 //Remote Control
            if(args.length < 2){
                if(!remote_user){
                    return message.channel.send('No one is controlling the bot right now');
                }
                if(remote_user === admins[0]){
                    return message.channel.send('The bot is currently being controlled by Lumi');
                }
                if(remote_user === admins[1]){
                    return message.channel.send('The bot is currently being controlled by Manu');
                }
                if(remote_user === admins[2]){
                    return message.channel.send('The bot is currently being controlled by Vorea');
                }
            }
            if(args[1] === '1' && !isControlled && !remote_user){
                isControlled = true;
                remote_user = sender.id;
                message.channel.send('You are now in control.\nUse ``!sv <0-1>`` to change servers (0 = Test server, 1 = Lumi/Manu Server).\nUse ``!ch <number>`` to change channels.');
            }
            if(args[1] === '0' && isControlled && sender.id === remote_user){
                isControlled = false;
                remote_user = '';
                message.channel.send('You are no longer in control.');
            }
            else return;
        }

        if(isControlled && sender.id === remote_user){

            if(msg.startsWith(prefix + 'SV')){
                
                if(args.length < 2) return;
                
                if(parseInt(args[1]) < 0 || parseInt(args[1]) > servers.length-1){
                    return message.channel.send('Number entered is out of bounds.')
                }

                remote_server = servers[parseInt(args[1])];
                message.channel.send('Successfully switched to **'+sv[remote_server].Name+'**');
                if(remote_server === servers[0]){
                    remote_channel = test_channels[0];
                    return message.channel.send('Switched to default channel **'+sv[remote_server].Text_Channels[remote_channel].Name+'**');
                }
                if(remote_server === servers[1]){
                    remote_channel = lumi_channels[0];
                    return message.channel.send('Switched to default channel **'+sv[remote_server].Text_Channels[remote_channel].Name+'**');
                }
                if(remote_server === servers[2]){
                    remote_channel = tiny_channels[0];
                    return message.channel.send('Switched to default channel **'+sv[remote_server].Text_Channels[remote_channel].Name+'**');
                }
            
            }

            if(msg.startsWith(prefix + 'CH')){

                if(args.length < 2) return;

                if(remote_server === servers[0]){

                    if(parseInt(args[1]) < 0 || parseInt(args[1]) > test_channels.length-1){
                        return message.channel.send('Number entered is out of bounds.')
                    }

                    remote_channel = test_channels[parseInt(args[1])];
                    return message.channel.send('Successfully switched to **'+sv[remote_server].Text_Channels[remote_channel].Name+'** in **'+sv[remote_server].Name+'**.');
                
                }

                if(remote_server === servers[1]){

                    if(parseInt(args[1]) < 0 || parseInt(args[1]) > lumi_channels.length-1){
                        return message.channel.send('Number entered is out of bounds.')
                    }

                    remote_channel = lumi_channels[parseInt(args[1])];
                    return message.channel.send('Successfully switched to **'+sv[remote_server].Text_Channels[remote_channel].Name+'** in **'+sv[remote_server].Name+'**.');
                
                }

                if(remote_server === servers[2]){

                    if(!admins[0]){
                        return message.channel.send('Sorry, you do not have permission to change to this server.')
                    }
                    
                    if(parseInt(args[1]) < 0 || parseInt(args[1]) > tiny_channels.length-1){
                        return message.channel.send('Number entered is out of bounds.')
                    }

                    remote_channel = tiny_channels[parseInt(args[1])];
                    return message.channel.send('Successfully switched to **'+sv[remote_server].Text_Channels[remote_channel].Name+'** in **'+sv[remote_server].Name+'**.');
                
                }

            }

            if(message.channel.type === 'dm'){ 
                console.log(message.channel.type)
                return message.client.guilds.get(remote_server).channels.get(remote_channel).send(message.content);
            }
            
        }


        /*~~~~~~~~~~~~~~~~~~~~~~~~COMMANDS~~~~~~~~~~~~~~~~~~~~~~~~*/


        if(msg.startsWith(prefix+'HELP')){
            message.delete(100);
            message.channel.send({
                content:"blah",
                embed:{
                color: 0xFF8623,
                author:{name:"Commands:"},
                thumbnail: {url: sender.avatarURL},
                fields:[{
                    name: "!help", 
                    value: 'Lists commands.'
                },
                {
                    name: "!nom @<name>", 
                    value: 'Nom someone. @<name> can be empty.'
                },
                {
                    name: "!roll <number>", 
                    value: 'Rolls a random number between 0-<number>.\nNote: <number> must be greater than or equal to 0.\nDefault: 1-10.'
                }
            ]
            }});
        }

        if(msg.startsWith(prefix + 'NOM')){
            let target = message.mentions.users.first();
            message.delete(100);
            if(!target){
                //return message.channel.send('Hey, <@'+sender.id+'>, you nommed the air as you did not mention someone. Use **!luminom @<name>**.')
                return message.channel.send('...*Looks at *<@'+sender.id+'>. *Nom! Glk! Gulp! Glrk!* Ahhhh~ \nYou were delicious, <@'+sender.id+'>~')
            }
            if(target.id === '411817452373278720'){
                return message.channel.send('I can\'t let you eat me, <@'+sender.id+'>~')
            }
            /*if(target.id === '183008488610332672'){
                return message.channel.send('I can\'t nom my creator!');
            }*/
            if(sender.id === target.id){
                let random_nom = ['You have somehow nommed yourself, <@'+sender.id+'>~', 'You failed to nom yourself, <@'+sender.id+'>~'];
                return message.channel.send(random_nom[Math.floor(Math.random()*(random_nom.length))]);
            }
            return message.channel.send('<@'+sender.id+'> has nommed <@'+target.id+'>!');
        }

        if(msg.startsWith(prefix + 'ROLL')){
            if(args.length < 2){
                return message.channel.send(Math.floor(Math.random()*10));
            }
            if(parseInt(args[1]) < 0){
                return message.channel.send('The number you entered is not valid.');
            }
            return message.channel.send('<@'+sender.id+'> has rolled a(n) '+Math.floor(Math.random()*parseInt(args[1])));
        }


        else{ 
            return;
        }
    }
    
    else return;
})



Client.on('guildMemberAdd', member =>{              //Greetings
    let greetings = [
        `Nom nom nom *Gulp* Welcome, ${member.user.username}`,
        `Welcome, ${member.user.username}`,
        `Good to have you here, ${member.user.username}`,
        `Hello, ${member.user.username}`,
        `Say hi to, ${member.user.username}`,
        `A new member! ${member.user.username}`,
        `Oooooooh! Hello, ${member.user.username}`
    ]
    let random_greet = Math.floor(Math.random()*greetings.length);
    let guild = member.guild;
    if(member.user.bot){
        return guild.channels.get('417216482808954911').send(`Fellow bot, ${member.user.username} has joined.`);
    }
    else return guild.channels.get('417216482808954911').send(greetings[random_greet]);
});



Client.on('guildMemberRemove', member =>{               //Departure
    let guild = member.guild;
    guild.channels.get(room_lobby).send(`${member.user.username} has left the server.`);
});



Client.login(process.env.BOT_TOKEN);
