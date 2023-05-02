const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { informations } = require('../config.json');

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_team')
        .setDescription('Generate a random team.')
        .addStringOption(option =>
			option
				.setName('players')
				.setDescription("Enter all the players' names and separate them with a space.")),
    async execute(interaction) {
        var players = interaction.options.getString('players');
        if(players != undefined){
            var player = players.split(" ");
        }else{
            var idVoice = interaction.member.voice.channelId;
            var voice = interaction.client.channels.cache.get(idVoice);
            if(voice == undefined){
                interaction.reply({ content: "You need to be in a voice channel or to enter the players' names.", ephemeral: true});
                return
            }
            var voicePlayers = voice.members;
            console.log(voicePlayers);
            var player = [];
            voicePlayers.forEach(member => {
                console.log(member)
                if(member.nickname != null){
                    player.push(member.nickname);
                }else{
                    player.push(member.user.username)
                }
            })
            console.log(player);
        }
        shuffle(player);
        var team1 = "";
        for(let i=0; i<player.length/2; i++){
            team1 += `\n${player[i]}`;
        }
        var team2 = "";
        for(let i=Math.floor(player.length/2)+1; i<player.length; i++){
            team2 += `\n${player[i]}`;
        }
        const embed = new EmbedBuilder()
            .setColor(0x2079b0)
            .setTitle("Random Team")
            .addFields(
                { name: "Team 1", value: team1, inline: true },
                { name: "Team 2", value: team2, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: informations.name, iconURL: informations.logo });
        await interaction.reply({ embeds: [embed] });
    },
};