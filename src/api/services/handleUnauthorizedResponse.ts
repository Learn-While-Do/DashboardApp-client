import { showModal, showNotification } from "@/composables/outlets";
import { get as getFromStore, set as setToStore, remove as removeFromStore } from "@/localStorage";
import ReLoginModal from "@/components/outlets/ReLoginModal.vue";
import router from "@/router";

export const handleUnauthorizedResponse = () => {

    if (getFromStore('temp') && getFromStore('temp').isReauthenticating) return;

    setToStore('temp', {isReauthenticating: true});

    const { username } = getFromStore('logged');

    removeFromStore('logged');

    router.push({
        name: 'dashboard'
    });

    showModal({
        component: ReLoginModal,
        props: {
            loginInfo: {
                username,
            },

            async onSuccess() {

                showNotification({
                    props: {
                        type: 'success',
                        duration: 5000,
                        message: 'You are logged back in',
                    },
                });

                setToStore('temp', {isReauthenticating: false});

                router.push({
                    name: 'orders',
                });
            },

            onTimeout() {
                showNotification({
                    props: {
                        type: 'info',
                        duration: 5000,
                        message: 'You need to log back in'
                    },
                });

                setToStore('temp', {isReauthenticating: false});
                router.push({
                    name: 'orders',
                });
            },

            onError(message: string) {
                showNotification({
                    props: {
                        type: 'error',
                        duration: 5000,
                        message
                    },
                });
            },
        },
    });

    return;
}