export default{
    state:{
        opponent: '',
        turn: '',
        status:''
    },
    mutations:{
        setOpponent(state: any,opponent: any){
            state.opponent = opponent
        },
        setTurn(state: any,turn: any){
            state.turn = turn
        },
        setStatus(state: any,status: any){
            state.status = status
        }
    }
}