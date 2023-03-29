
export default {
    namespaced: true,
    state: {
        currentWorkSpace: {
            id:undefined,
            name:undefined,
            code:undefined,
            isAdmin:undefined
        }
    },
    getters: {
        isAdmin: (getters) => {
            return getters.currentWorkSpace.isAdmin
        },
        currentWorkSpace: state => {
            if (!state.currentWorkSpace) {
                try {
                    const workspace = localStorage.getItem(process.env.VUE_APP_WORKSPACE_KEY)
                    state.workspace = JSON.parse(workspace)
                } catch (e) {
                    console.error(e)
                }
            }
            return state.currentWorkSpace
        }
    },
    mutations: {
        setWorkSpace: (state, currentWorkSpace) => {
            state.currentWorkSpace = currentWorkSpace
            localStorage.setItem(process.env.VUE_APP_WORKSPACE_KEY, JSON.stringify(currentWorkSpace))
        }
    },


}
