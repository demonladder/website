export default function parseDict(dict) {
    function parseData(data) {
        switch (data.name) {
            case 's': return data.elements[0].text;
            case 'i': return parseInt(data.elements[0].text);
            case 'r': return parseFloat(data.elements[0].text);
            case 't': return true;
            case 'f': return false;
            case 'd':
                if (!data.elements) return [];
                return parseDict(data.elements);
            default: return data.elements[0].text;
        }
    }

    const keys = {
        GS_value: "stats",
        GS_completed: "completedLevels",
        GS_3: "userCoins",
        GS_4: "bronzeUserCoins",
        GS_5: "mapPackStars",
        GS_6: "shopPurchases",
        GS_7: "levelProgress",
        GS_9: "levelStars",
        GS_10: "officialLevelProgress",
        GS_11: "dailyRewards",
        GS_12: "quests",
        GS_14: "questRewards",
        GS_15: "queuedQuests",
        GS_16: "dailyProgress",
        GS_17: "dailyStars",
        GS_18: "gauntletProgress",
        GS_19: "treasureRoomRewards",
        GS_20: "totalDemonKeys",
        GS_21: "rewards",
        GS_22: "gdWorldRewards",
        GS_23: "gauntletProgress2",
        GS_24: "dailyProgress2",
        GS_25: "weeklyRewards",
        GLM_01: "officialLevels",
        GLM_02: "uploadedLevels",
        GLM_03: "onlineLevels",
        GLM_04: "starredLevels",
        GLM_06: "followedAccounts",
        GLM_07: "recentlyPlayed",
        GLM_08: "enabledSearchFilters",
        GLM_09: "availableSearchFilters",
        GLM_10: "timelyLevels",
        GLM_11: "dailyID",
        GLM_12: "likes",
        GLM_13: "ratedLevels",
        GLM_14: "reportedLevels",
        GLM_15: "ratedDemons",
        GLM_16: "gauntlets",
        GLM_17: "weeklyID",
        GLM_18: "levelFolders",
        GLM_19: "createdLevelFolders",
        GJA_001: "username",
        GJA_002: "password",
        GJA_003: "accountID",
        GJA_004: "sessionID",
        LLM_01: "localLevels",
        LLM_02: "binaryVersion",
        MDLM_001: "songInfo",
        MDLM_002: "songPriority",
        KBM_001: "keybinds",
        KBM_002: "keybinds2",
        texQuality: "textureQuality",
        customObjectDict: "customObjects",
        playerUserID: "playerID",
        reportedAchievements: "achievements",
        secretNumber: "cod3breakerSolution",
        clickedGarage: "clickedIconKit",
        hasRP: "isMod"
    }

    const obj = {};

    for (let i = 0; i < dict.length; i += 2) {
        let key = dict[i].elements[0].text;
        if (keys[key]) key = keys[key];

        obj[key] = parseData(dict[i+1]);;
    }

    return obj;
}