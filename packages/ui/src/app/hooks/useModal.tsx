import { useState } from "react";

export function useModal() {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return { showModal, openModal, closeModal };
}
