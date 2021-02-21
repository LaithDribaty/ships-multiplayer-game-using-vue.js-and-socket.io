<template>
	<table v-if="user=='me'">
		<tr v-for="i in 9" v-bind:key="i" class="row">
			<td v-for="j in 9" v-bind:key="j" class="col" :class="[thereIsShip(i,j) ? 'myship' : '' , hitted(i , j)? 'hitted' : '' ,shipHitted(i , j)? 'shipHitted' : '' ]">
				
			</td>
		</tr>
	</table>
	<table v-else>			
		<tr v-for="i in 9" v-bind:key="i" class="row">
			<td v-for="j in 9" v-bind:key="j" class="col col1" v-on:click="move(i , j)" :class="[hitted(i , j)? 'hitted' : '',shipHitted(i , j)? 'shipHitted' : '']" >

			</td>
		</tr>
	</table>
</template>

<script>
	export default {
		name: 'Field',
		props:['user' , 'ShipsPositions' , 'Socket' , 'positions'],	
		data() {
			return {
				
			};
		},
		mounted() {
			
		},
		methods: {
			thereIsShip(i , j){
				return this.ShipsPositions[i-1][j-1];
			},
			move(i , j){
				this.Socket.emit("move" , {x:i , y:j});
			},
			hitted(i , j){
				return this.positions[i-1][j-1]==1;
			},
			shipHitted(i , j) {
				return this.positions[i-1][j-1]==2;
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.row{
		width:100%;
		height:35px;
	}
	.col{
		border:solid 1px black;
	}
	.col1:hover{
		background-color: rgba(0 , 0 , 0, 0.5);
	}
	.myship{
		background-color:rgba(0 , 0, 0, 0.5);
	}
	.hitted{
		background-color:red !important;
	}
	.shipHitted{
		background-color:rgb(202, 58, 221) !important;
	}
</style>
