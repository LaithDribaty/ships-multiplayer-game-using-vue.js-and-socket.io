<template>
    <div>
		<br>
		<center>
			<button v-on:click="reset()" class="reset btn"> reset </button>
		</center>
		<br>
		<center>
			<table>
				<tr v-for="i in 9" v-bind:key="i" class="row">
					<td v-for="j in 9" v-bind:key="j" class="col" @mouseover="mouseOver(i , j)" @mousedown="mouseDown(i , j)" @mouseleave="mouseLeave(i , j)" v-bind:id="i+' '+j">
						
					</td>
				</tr>
			</table>
		</center>
		<br>
		<center>
			<table class="table">
				<tr>
					<td>
						<input type="radio" name="ship" value="4" v-on:click="set(4,true)">
					</td>
					<td>
						<input type="radio" name="ship" value="4" v-on:click="set(4,false)">
					</td>
					<td>
						<input type="radio" name="ship" value="3" v-on:click="set(3,true)"> 
					</td>
					<td>
						<input type="radio" name="ship" value="3" v-on:click="set(3,false)">
					</td>
					<td>
						<input type="radio" name="ship" value="2" v-on:click="set(2,true)">
					</td>
					<td>
						<input type="radio" name="ship" value="2" v-on:click="set(2,false)">
					</td>
					<td>
						<input type="radio" name="ship" value="1" v-on:click="set(1,true)">
					</td>
				</tr>
				<tr>
					<td>
						<img src="../assets/ships shapes/four horizontal.jpg" alt="">
					</td>
					<td>
						<img src="../assets/ships shapes/four vertical.jpg" alt="">
					</td>
					<td>
						<img src="../assets/ships shapes/three horizontal.jpg" alt="">
					</td>
					<td>
						<img src="../assets/ships shapes/three vertical.jpg" alt="">
					</td>
					<td>
						<img src="../assets/ships shapes/two horizontal.jpg" alt="">
					</td>
					<td>
						<img src="../assets/ships shapes/two vertical.jpg" alt="">
					</td>
					<td>
						<img src="../assets/ships shapes/one.jpg" alt="">
					</td>
				</tr>
			</table>
		</center>
		
	</div>
</template>

<script>
	export default {
		name: 'FirstPanel',	
		props:['positions'],
		data() {
			return {
				curShipNum: 4,
				horizontal: true,
				ships: [null , null , null , null],
			};
		},
		methods:{
			set(shipNum , direction){
				this.curShipNum = shipNum;
				this.horizontal = direction;
			},
			mouseOver(i , j) {
				let en = (this.horizontal)? j : i; en += this.curShipNum;
				if(en > 10)return ;

				if(this.horizontal){ // add the j
					for (let index = j; index < en; index++) {
						document.getElementById(i+' '+index).style = "background-color:rgba(125 , 125 , 125 , 1)";
					}
				} else { // add the i
					for (let index = i; index < en; index++) {
						document.getElementById(index+' '+j).style = "background-color:rgba(125 , 125 , 125 , 1)";
					}
				}
			},
			mouseLeave(i , j){
				let en = (this.horizontal)? j : i; en += this.curShipNum;
				if(en > 10)return ;

				if(this.horizontal){ // add the j
					for (let index = j; index < en; index++) {
						document.getElementById(i+' '+index).style = "background-color:rgba(255 , 255 , 255 , 1)";
					}
				} else { // add the i
					for (let index = i; index < en; index++) {
						document.getElementById(index+' '+j).style = "background-color:rgba(255 , 255 , 255 , 1)";
					}
				}
			},
			mouseDown(i , j){
				let en = (this.horizontal)? j : i; en += this.curShipNum;
				if(en > 10)return ;				

				if(this.horizontal){ // add the j
					for (let index = j; index < en; index++) 
						if(this.positions[i-1][index-1])return;
					
					this.erasePreviuose();
					for (let index = j; index < en; index++) {
						document.getElementById(i+' '+index).classList = "selected";
						this.positions[i-1][index-1] = true;
					}
					this.ships[this.curShipNum-1] = {x:i , y:j , direction:this.horizontal};
				} else { // add the i
					for (let index = i; index < en; index++) 
						if(this.positions[index-1][j-1])return;
					
					this.erasePreviuose();
					for (let index = i; index < en; index++) {
						document.getElementById(index+' '+j).classList = "selected";
						this.positions[index-1][j-1] = true;
					}
					this.ships[this.curShipNum-1] = {x:i , y:j , direction:this.horizontal};
				}
			},
			reset(){
				for (let i = 1; i <= 9; i++) {
					for (let j = 1; j <= 9; j++) {
						this.positions[i-1][j-1] = false;
						document.getElementById(i+' '+j).style = "background-color:rgba(255 , 255 , 255 , 1)";
						document.getElementById(i+' '+j).classList = "col";
					}
				}
			},
			erasePreviuose() {
				if(this.ships[this.curShipNum-1]){
					let temp = this.ships[this.curShipNum-1];
					let tempEn = (temp.direction)? temp.y : temp.x; 
					tempEn += this.curShipNum;
					if(temp.direction){
						for (let index = temp.y; index < tempEn; index++){
							document.getElementById(temp.x+' '+index).classList = "col";
							this.positions[temp.x-1][index-1] = false;	
						}
					} else {
						for (let index = temp.x; index < tempEn; index++){
							document.getElementById(index+' '+temp.y).classList = "col";
							this.positions[index-1][temp.y-1] = false;	
						}	
					}
				}
			},
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	table{
		width: 50%;
	}
	td{
		text-align: center;
	}
	.row{
		width:100%;
		height:35px;
	}
	.col{
		border:solid 1px black;
	}
	.selected{
		background-color:rgb(60, 118, 167) !important;
	}
	.s{
		background-color:rgb(255, 255, 255) !important;
	}
	.btn{
		width: 100px;
		height: 50px;
		border: solid 1px rgb(155, 141, 141);
		border-radius: 7px;
	}
	.reset{
		background-color: cadetblue;
	}
</style>
