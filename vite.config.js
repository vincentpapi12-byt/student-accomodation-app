
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/student-accomodation-app/',

    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                submit: 'submit.html',
                admin: 'admin.html'
            }
        }
    }
})