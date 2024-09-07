export default{
    state: {
        status: "matching",
        wsurl: "ws://127.0.0.1:8080/websocket",
        socket: "",
        opponent_name: "",
        turn: " "
    },
    getters: {
        
    },
    mutations: {
        updateStatus(state: any,status: any){
            state.status=status
        },
        
        updateUrl(state: any,wsurl: any){
            state.wsurl=wsurl
        },

        updateName(state: any,name: any){
            state.opponent_name=name
        },

        updateTurn(state: any,turn: any){
            state.turn=turn
        }
    },
    actions: {

    },
    modules: {

    }
}
