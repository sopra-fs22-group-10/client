const toggleDict = {};

export const isHovered = (cardId) => {
    if (cardId in toggleDict){
        return toggleDict[cardId];
    } else {
        return false
    }
}

export const toggleHover = (cardId) => {
    if (cardId in toggleDict){
        toggleDict[cardId] = !toggleDict[cardId];
    } else {
        toggleDict[cardId] = true;
    }
    console.log("hovering");
}
