import { useEffect, useState } from 'react'


const useImage = (fileName: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [image, setImage] = useState(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await import(`@/assets/plants/${fileName}.png`)
                setImage(response.default)
            } catch (err) {
                setError(err)
                const response = await import(`@/assets/plants/growing.png`)
                setImage(response.default)
            } finally {
                setLoading(false)
            }
        }

        fetchImage()
    }, [fileName])

    return {
        loading,
        error,
        image,
    }
}

export default useImage