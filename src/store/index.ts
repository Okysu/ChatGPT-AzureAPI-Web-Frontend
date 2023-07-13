// Utilities
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(
    createPersistedState({
        storage: localStorage,
        key: id => `__persisted__${id}`,
        auto: true,
    })
)

export default pinia
