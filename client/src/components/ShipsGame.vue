<template>
	<div v-if="!monitoring && winner==-1">
		<center>
			<button v-on:click="refresh()" class="refresh btn"> refresh </button>
			<button v-on:click="newGame()" class="newgame btn"> new game </button>
		</center>
		<br>
		<center v-if="!Ready"><button v-on:click="ready()" class="ready btn"> ready </button></center>
		<br>
		<center v-if="!Ready">
			<span class="name">
				enter your name:
			</span>
			<input type="text" name="name" value="" id="name" v-on:keyup="setName()" class="namefield">
		</center>
		<FirstPanel v-if="!Ready" v-bind:positions="this.Positions"/>
		<table v-else>
			<tr>
				<td v-if="numberOfPeople >= 1" class="cell"> 
					<!-- player 1 -->
					
					{{ this.names[this.playerNumber%this.numberOfPeople] }}
					<Field user="me" v-bind:ShipsPositions="Positions" v-bind:positions="hittedPositions[playerNumber%numberOfPeople]" />
				</td>

				<td v-if="numberOfPeople >= 2" class="cell">  
					<!-- player 2 -->
					{{ this.names[(this.playerNumber+1)%this.numberOfPeople] }}
					<Field user="op" v-bind:Socket="socket" v-bind:positions="hittedPositions[(playerNumber+1)%numberOfPeople]" />
				</td>
			</tr>

			<tr>
				<td v-if="numberOfPeople >= 3" class="cell">  
					<!-- player 3 -->
					{{ this.names[(this.playerNumber+2)%this.numberOfPeople] }}
					<Field user="op" v-bind:Socket="socket" v-bind:positions="hittedPositions[(playerNumber+2)%numberOfPeople]" />
				</td>

				<td v-if="numberOfPeople >= 4" class="cell">  
					<!-- player 4 -->
					{{ this.names[(this.playerNumber+3)%this.numberOfPeople] }}
					<Field user="op" v-bind:Socket="socket" v-bind:positions="hittedPositions[(playerNumber+3)%numberOfPeople]" />
				</td>
			</tr>
		</table>
	</div>
	<div v-else-if="winner!=-1 && !monitoring">
		<center style="font-size:70px;"> {{ this.names[winner] }} is the winner </center>
	</div>	
	<div v-else>
		<table v-if="winner==-1">
			<tr>
				<td v-if="numberOfPeople >= 1" class="cell"> 
					<!-- player 1 -->
					
					{{ this.names[0] }}
					<Field user="me" v-bind:ShipsPositions="monitoringPositions[0]" v-bind:positions="hittedPositions[0]" />
				</td>
				<td v-if="numberOfPeople >= 2" class="cell"> 
					<!-- player 2 -->
					
					{{ this.names[1] }}
					<Field user="me" v-bind:ShipsPositions="monitoringPositions[1]" v-bind:positions="hittedPositions[1]" />
				</td>
			</tr>
			<tr>
				<td v-if="numberOfPeople >= 3" class="cell"> 
					<!-- player 3 -->
					
					{{ this.names[2] }}
					<Field user="me" v-bind:ShipsPositions="monitoringPositions[2]" v-bind:positions="hittedPositions[2]" />
				</td>
				<td v-if="numberOfPeople >= 4" class="cell"> 
					<!-- player 4 -->
					
					{{ this.names[3] }}
					<Field user="me" v-bind:ShipsPositions="monitoringPositions[3]" v-bind:positions="hittedPositions[3]" />
				</td>
			</tr>
		</table>
		<div v-else>
			<center style="font-size:70px;"> {{ this.names[winner] }} is the winner </center>
		</div>	
	</div>
</template>

<script>
	import io from "socket.io-client";
	import Field from "./Field.vue";
	import FirstPanel from "./FirstPanel.vue";

	export default {
		name: 'ShipsGame',
		components: {
			Field , FirstPanel 
		},
		data() {
			return {
				socket : {},
				monitoring:false,
				playerName: "",
				Ready : false,
				numberOfPeople: 0,
				playerNumber: 0,
				Positions : [],
				hittedPositions:[],
				names: [],
				winner: -1,
				monitoringPositions: [],
			};
		},
		created() {
			let url = window.location.href;
			let isLocal = url.search("localhost");
			if(isLocal != -1)
				this.socket = io("http://localhost:3000"); // if only local game.
			else
				this.socket = io("http://77.44.185.243:3000"); // if only online people

			// in server you will change all of that with your domain name
			
			this.Positions = new Array(9).fill(false).map(() => new Array(9).fill(false));
		} , 
		mounted() {
			this.socket.on("monitoring" , data=>{
				this.monitoring = data;
			});
			this.socket.on("start" , data=>{
				this.numberOfPeople = data;
			});
			this.socket.on("start2" , data=>{
				this.playerNumber = data;
			});
			this.socket.on("start3" , data=>{
				this.hittedPositions = data;
			});
			this.socket.on("hittedPosition" , data=>{
				this.hittedPositions = data;
			});
			this.socket.on("names" , data=>{
				this.names = data;
			});
			this.socket.on("winner" , data=>{
				this.winner = data;
			});
			this.socket.on("monetoringPositions" , data=>{
				this.monitoringPositions = data;
			});
			
			/* send the ships positions */
		},
		methods: {
			ready() {
				this.checkIfThereIsShips();
				if(this.Ready){
					this.socket.emit("ShipsPositions" , this.Positions);
					this.socket.emit("name" , this.playerName);
					this.socket.emit("ready" , true);
				}
			},
			checkIfThereIsShips(){
				// we can implement this deffeternt ways to handle ships excisted or not 
				for (let i = 0; i < 9; i++) 
					for (let j = 0; j < 9; j++) 
						if(this.Positions[i][j])
							this.Ready = true;
			} ,
			setName() {
				this.playerName = document.getElementById('name').value;
			},
			refresh(){
				this.socket.emit("refresh");
			},
			newGame(){
				window.open("http://localhost:8080");
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	table{
		width: 100%;
	}
	
	.cell{
		text-align:center;
		border:solid 4px black;
	}
	.btn{
		width: 100px;
		height: 50px;
		border: solid 1px rgb(155, 141, 141);
		border-radius: 7px;
	}
	.refresh{
		margin-right: 10px;
		background-color: antiquewhite;
	}
	.newgame{
		background-color: rgb(116, 86, 48);
	}
	.ready{
		background-color: rgb(53, 184, 108);
	}
	.name{
		font-size: 30px;
		font-family: cursive;
	}
	.namefield{
		width: 200px;
		height: 30px;
	}
</style>
