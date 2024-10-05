export default{
    state:{
        opponent_name: '',
        opponent_level: '',
        opponent_rank: '',
        turn: '',
        status:''
    },
    mutations:{
        setOpponent(state: any,opponent: any){
            state.opponent_name = opponent.name
            state.opponent_level = opponent.level
            state.opponent_rank = opponent.rank
        },
        setTurn(state: any,turn: any){
            state.turn = turn
        },
        setStatus(state: any,status: any){
            state.status = status
        }
    }
}