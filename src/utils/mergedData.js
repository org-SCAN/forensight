

export function mergeData(extractedJson, extractedImages) {
    const imageMap = new Map(extractedImages.map(img => [img.id, img.imageBlob]));

    return extractedJson.map(item => ({
        ...item,
        data: {
            ...item.data,
            coordinates: item.data.coordinates.map(coord => ({
                ...coord,
                imageBlob: imageMap.get(coord.id) || null
            }))
        }
    }));
}
