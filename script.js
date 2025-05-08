document.addEventListener('DOMContentLoaded', function() {
    // App state
    const appState = {
        theme: localStorage.getItem('theme') || 'light',
        amateurLevel: parseInt(localStorage.getItem('amateurLevel') || 3),
        history: JSON.parse(localStorage.getItem('promptHistory') || '[]'),
        favorites: JSON.parse(localStorage.getItem('promptFavorites') || '[]'),
        currentPrompt: null,
        isEditingPrompt: false
    };

    // DOM Elements - Core UI
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const generateBtn = document.getElementById('generate-btn');
    const randomBtn = document.getElementById('random-btn');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const copyPositiveBtn = document.getElementById('copy-positive-btn');
    const copyNegativeBtn = document.getElementById('copy-negative-btn');
    const positiveOutput = document.getElementById('positive-output');
    const negativeOutput = document.getElementById('negative-output');
    const customSubjectInput = document.getElementById('custom-subject');
    const amateurLevelInput = document.getElementById('amateur-level');
    const amateurLevelValue = document.getElementById('amateur-level-value');
    
    // Tab system elements
    const settingsTab = document.getElementById('settings-tab');
    const resultsTab = document.getElementById('results-tab');
    const historyTab = document.getElementById('history-tab');
    const favoritesTab = document.getElementById('favorites-tab');
    const settingsContent = document.getElementById('settings-content');
    const resultsContent = document.getElementById('results-content');
    const historyContent = document.getElementById('history-content');
    const favoritesContent = document.getElementById('favorites-content');
    
    // Favorites and history elements
    const favoriteBtn = document.getElementById('favorite-btn');
    const editPromptBtn = document.getElementById('edit-prompt-btn');
    const editNegativeBtn = document.getElementById('edit-negative-btn');
    const historyList = document.getElementById('history-list');
    const favoritesList = document.getElementById('favorites-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
    const sendToSdBtn = document.getElementById('send-to-sd-btn');
    
    // Modal elements
    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutModal = document.getElementById('close-about-modal');
    const quickSubjectBtn = document.getElementById('quick-subject-btn');
    const quickSubjectModal = document.getElementById('quick-subject-modal');
    const closeSubjectModal = document.getElementById('close-subject-modal');
    const quickSubjectGrid = document.getElementById('quick-subject-grid');
    
    // Form elements
    const subjectSelect = document.getElementById('subject');
    const locationSelect = document.getElementById('location');
    const lightingSelect = document.getElementById('lighting');
    const cameraSelect = document.getElementById('camera');
    const mistakesSelect = document.getElementById('mistakes');
    const timePeriodSelect = document.getElementById('time-period');
    
    // Prompt data for generating prompts
    const promptData = {
        subject: {
            'portrait': ['person', 'woman', 'man', 'teenager', 'elderly person', 'middle-aged person', 'young adult'],
            'landscape': ['countryside scene', 'hills', 'mountains', 'field', 'meadow', 'forest', 'lake view'],
            'street': ['street scene', 'city street', 'urban area', 'sidewalk', 'alleyway', 'downtown'],
            'food': ['meal', 'plate of food', 'restaurant dish', 'homemade dinner', 'fast food', 'breakfast'],
            'pet': ['dog', 'cat', 'hamster', 'fish', 'bird', 'guinea pig', 'rabbit', 'turtle'],
            'family': ['family group', 'parents with children', 'family gathering', 'siblings', 'relatives'],
            'travel': ['tourist location', 'famous landmark', 'vacation spot', 'hotel view', 'airport', 'train station'],
            'event': ['birthday party', 'graduation', 'wedding ceremony', 'family reunion', 'holiday celebration'],
            'nature': ['flowers', 'trees', 'plants', 'garden', 'park', 'wildlife', 'insects', 'animals in nature'],
            'object': ['household item', 'furniture', 'decoration', 'collection', 'toy', 'trinket', 'souvenir'],
            'sport': ['sporting event', 'game', 'match', 'race', 'competition', 'player', 'athlete', 'team'],
            'vehicle': ['car', 'truck', 'motorcycle', 'bicycle', 'boat', 'airplane', 'SUV', 'van', 'bus'],
            'selfie': ['selfie', 'self-portrait', 'mirror selfie', 'face close-up', 'selfie with friends'],
            'child': ['child', 'toddler', 'baby', 'kid playing', 'school child', 'kid posing'],
            'beach': ['beach scene', 'ocean view', 'people at beach', 'beach day', 'seashore', 'coastal area'],
            'night': ['night scene', 'nightlife', 'starry sky', 'city at night', 'night lights'],
            'concert': ['band performing', 'music concert', 'live music', 'concert crowd', 'stage performance'],
            'party': ['house party', 'dance party', 'celebration', 'get-together', 'friends hanging out'],
            'graduation': ['graduate', 'graduation ceremony', 'diploma', 'graduate with cap and gown'],
            'wedding': ['bride and groom', 'wedding ceremony', 'wedding party', 'wedding reception']
        },
        location: {
            'home': ['living room', 'kitchen', 'bedroom', 'bathroom', 'home interior', 'front yard', 'porch', 'garage'],
            'backyard': ['backyard', 'garden', 'patio', 'deck', 'lawn', 'outdoor home space', 'BBQ area'],
            'park': ['public park', 'playground', 'walking path', 'park bench', 'picnic area', 'grassy area'],
            'beach': ['sandy beach', 'shoreline', 'beach umbrella', 'oceanfront', 'beachside', 'boardwalk'],
            'city': ['downtown area', 'city street', 'urban environment', 'city buildings', 'sidewalk'],
            'restaurant': ['restaurant interior', 'dining table', 'cafe', 'fast food place', 'diner', 'food court'],
            'party': ['house party', 'birthday party', 'celebration venue', 'party decoration', 'event space'],
            'tourist': ['tourist attraction', 'landmark', 'monument', 'famous location', 'sightseeing spot'],
            'mall': ['shopping mall', 'retail store', 'shopping center', 'department store', 'store aisle'],
            'school': ['classroom', 'school hallway', 'campus', 'school cafeteria', 'schoolyard', 'gymnasium'],
            'office': ['office space', 'workplace', 'cubicle', 'desk area', 'conference room', 'break room'],
            'gym': ['fitness center', 'weight room', 'exercise area', 'sports facility', 'indoor gym'],
            'concert': ['concert venue', 'arena', 'outdoor stage', 'crowd', 'stadium', 'amphitheater'],
            'forest': ['wooded area', 'forest path', 'trees', 'woodland', 'hiking trail', 'nature setting'],
            'mountain': ['mountain view', 'hillside', 'mountain trail', 'lookout point', 'mountain range'],
            'lake': ['lakeside', 'lake view', 'dock', 'fishing spot', 'lakefront', 'pond', 'reservoir'],
            'pool': ['swimming pool', 'pool deck', 'community pool', 'backyard pool', 'water park'],
            'car': ['car interior', 'front seat', 'back seat', 'driving', 'passenger view', 'dashboard view'],
            'stadium': ['sports arena', 'ball field', 'stands', 'bleachers', 'sporting venue', 'court'],
            'airport': ['airport terminal', 'boarding gate', 'runway view', 'baggage claim', 'departure lounge']
        },
        lighting: {
            'harsh-flash': ['bright flash lighting', 'direct flash', 'harsh lighting', 'strong flash', 'over-lit flash'],
            'indoor': ['indoor lighting', 'artificial light', 'household lighting', 'dim indoor light', 'room lighting'],
            'natural': ['natural daylight', 'sunlight', 'outdoor lighting', 'natural light', 'daylight'],
            'sunset': ['sunset lighting', 'golden hour', 'warm evening light', 'dusk lighting', 'sunset glow'],
            'dark': ['dim lighting', 'poorly lit', 'low light conditions', 'too dark', 'insufficient lighting'],
            'overexposed': ['too bright', 'washed out lighting', 'blown out highlights', 'overexposed', 'excessive light'],
            'mixed': ['mixed lighting', 'conflicting light sources', 'unbalanced lighting', 'multiple light types'],
            'fluorescent': ['fluorescent lights', 'office lighting', 'greenish lighting', 'institutional lighting'],
            'evening': ['evening light', 'twilight', 'dusky lighting', 'after sunset', 'fading daylight'],
            'morning': ['early morning light', 'dawn lighting', 'sunrise', 'morning glow', 'cool morning light'],
            'window': ['window light', 'side lighting', 'coming through windows', 'streaming through blinds'],
            'shade': ['shaded area', 'under tree shade', 'shadow lighting', 'shady spot', 'umbrella shade'],
            'candlelight': ['candle lighting', 'soft warm glow', 'dinner candle light', 'romantic lighting'],
            'streetlight': ['street lamp lighting', 'outdoor night lighting', 'city light', 'artificial outdoor light'],
            'neon': ['neon lighting', 'colorful artificial light', 'sign lighting', 'vibrant colored light'],
            'backlit': ['backlit subject', 'silhouette lighting', 'light from behind', 'rim lighting', 'contre-jour'],
            'tungsten': ['warm tungsten lighting', 'yellowish indoor light', 'old light bulbs', 'incandescent'],
            'cloudy': ['overcast lighting', 'soft cloudy day light', 'diffused daylight', 'gray day lighting'],
            'night': ['night time lighting', 'darkness', 'minimal available light', 'night scene lighting'],
            'screens': ['screen light', 'blue light', 'light from device', 'computer glow', 'television light']
        },
        camera: {
            'smartphone': ['smartphone camera', 'iPhone camera', 'Android phone camera', 'mobile phone photo'],
            'point-and-shoot': ['compact digital camera', 'point and shoot camera', 'simple digital camera'],
            'old-digital': ['old digital camera', 'outdated digital camera', 'early 2000s digital', 'first digital camera'],
            'disposable': ['disposable camera', 'one-time-use camera', 'film disposable', 'cheap disposable'],
            'polaroid': ['instant polaroid camera', 'polaroid snapshot', 'instant film camera', 'instant print camera'],
            'webcam': ['webcam photo', 'computer camera', 'laptop camera', 'video chat camera'],
            'tablet': ['tablet camera', 'iPad photo', 'tablet photo quality', 'tablet device camera'],
            'flip-phone': ['flip phone camera', 'early camera phone', 'old cell phone camera', 'basic phone camera'],
            'action-cam': ['action camera', 'GoPro', 'sports camera', 'helmet camera', 'adventure camera'],
            'toy-camera': ['toy camera', "children's camera", 'plastic camera', 'novelty camera'],
            'lomography': ['lomo camera', 'lomography style', 'experimental film camera', 'artistic film camera'],
            'film': ['35mm film camera', 'film photography', 'analog camera', 'film snapshot'],
            'instant': ['instant camera', 'Fujifilm Instax', 'instant print photo', 'instant film photography'],
            'cctv': ['surveillance camera', 'security camera', 'CCTV footage', 'monitoring camera'],
            'vhs': ['VHS camera', 'home video camera', 'vintage camcorder', '80s-90s video camera'],
            'digital-compact': ['digital compact camera', 'small digital camera', 'pocket digital camera'],
            'camcorder': ['home camcorder', 'family video camera', 'handheld video camera', 'home movies camera'],
            'bridge-camera': ['bridge camera', 'semi-professional camera', 'advanced point and shoot'],
            'outdated-phone': ['outdated phone camera', 'old smartphone camera', '2010 phone camera'],
            'security-cam': ['security camera footage', 'surveillance footage', 'security monitoring camera']
        },
        mistakes: {
            'none': ['', '', ''],
            'blurry': ['out of focus', 'motion blur', 'camera shake', 'blurry image', 'focus issues', 'not sharp'],
            'finger': ['finger over lens', 'finger in frame', 'partially blocked by finger', 'thumb in corner'],
            'tilted': ['crooked horizon', 'tilted angle', 'slanted perspective', 'unlevel photo', 'rotated frame'],
            'red-eye': ['red eye effect', 'red pupil', 'glowing red eyes', 'flash eye reflection'],
            'bad-crop': ['poorly cropped', 'bad framing', 'awkward composition', 'cut off subject', 'cramped framing'],
            'motion-blur': ['subject movement blur', 'too slow shutter speed', 'motion not frozen', 'action blur'],
            'lens-flare': ['unwanted lens flare', 'lens reflection', 'light spots', 'sun flare artifact'],
            'shadow': ['photographer shadow visible', 'shadow in frame', 'self shadow in photo', 'camera shadow'],
            'too-close': ['too close to subject', 'no breathing room', 'uncomfortably close framing', 'invasion of space'],
            'too-far': ['subject too distant', 'too much empty space', 'subject too small in frame', 'shot from too far'],
            'closed-eyes': ['subject blinking', 'eyes closed', 'mid-blink photo', 'closed eyelids'],
            'double-exposure': ['accidental double exposure', 'multiple exposures', 'overlapping images', 'ghost image'],
            'light-leak': ['light leak', 'film light exposure', 'unwanted light streak', 'film damage effect'],
            'dust': ['dust spots on lens', 'dirty lens', 'visible sensor dust', 'spots in image', 'smudges on lens'],
            'wrong-focus': ['wrong focus point', 'background in focus instead of subject', 'missed focus', 'focus error'],
            'flash-reflections': ['flash reflected in mirror', 'flash reflected in window', 'flash bounce reflections'],
            'head-cut': ['top of head cut off', 'poor subject framing', 'partial subject', 'important parts cropped'],
            'overprocessed': ['heavy filters', 'overdone editing', 'excessive post-processing', 'unnatural editing'],
            'bad-timing': ['awkward timing', 'unflattering moment', 'caught at bad moment', 'poorly timed photo']
        },
        timePeriod: {
            'none': ['', '', ''],
            '70s': ['1970s look', '70s photography style', '1970s aesthetic', '70s era photo'],
            '80s': ['1980s style', '80s look', '1980s aesthetic', '80s era photo', 'eighties photo quality'],
            '90s': ['1990s look', '90s photography', '1990s aesthetic', '90s style photo'],
            '2000s': ['early 2000s style', '2000s digital look', 'Y2K era aesthetic', 'early millennium look'],
            '2010s': ['2010s photo quality', 'early smartphone era', 'social media era photo', 'Instagram period'],
            'present': ['current day photo', 'modern photography', 'contemporary photo style', 'today\'s camera quality'],
            'digital-era': ['digital camera era', 'digital photography period', 'early digital camera look'],
            'film-era': ['film photography era', 'pre-digital period', 'analog photography days'],
            'early-digital': ['early digital camera quality', 'first generation digital', 'primitive digital camera'],
            'social-media': ['social media photography era', 'Instagram period', 'Facebook photo days', 'selfie era'],
            'pre-smartphone': ['before smartphone cameras', 'pre-iPhone camera era', 'dedicated camera period'],
            'smartphone-era': ['smartphone photography period', 'mobile photography era', 'phone camera days'],
            'myspace': ['MySpace era photography', 'mid-2000s social media look', 'early social platform days'],
            'flip-phone-era': ['flip phone camera days', 'pre-smartphone mobile', 'basic phone camera period'],
            'disposable-era': ['disposable camera heyday', '90s-00s disposable camera look', 'film single-use camera days'],
            'polaroid-era': ['polaroid boom period', 'instant film days', 'classic polaroid era', 'instant photography'],
            'vhs-era': ['VHS recording period', 'home video days', 'analog video era', '80s-90s camcorder period'],
            'photo-album': ['family photo album era', 'physical photo collection days', 'pre-digital storage period'],
            'vintage': ['vintage photography', 'retro photo style', 'classic photography period', 'old-fashioned photo']
        },
        styles: [
            'snapshot aesthetic',
            'candid photo style',
            'family photo',
            'vacation photo',
            'casual photography',
            'everyday life photo',
            'spontaneous snapshot',
            'personal photo',
            'home photography',
            'amateur documentation',
            'casual snapshot',
            'informal portrait',
            'personal memento',
            'impromptu picture',
            'casual shot',
            'quick snapshot',
            'normal person photography',
            'regular person photo',
            'ordinary photography',
            'casual picture-taking',
            'non-professional style',
            'home photo',
            'domestic photography',
            'unpolished snap',
            'untrained photographer',
            'photographic record',
            'memory capture',
            'everyday moment',
            'photo album material',
            'spur of the moment photo'
        ]
    };
    
    // Initialize quick subject grid
    populateQuickSubjectGrid();
    
    // ======================================
    // Theme handling
    // ======================================
    
    // Initialize theme
    function initTheme() {
        if (appState.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        if (appState.theme === 'light') {
            appState.theme = 'dark';
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            appState.theme = 'light';
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', appState.theme);
    }
    
    // ======================================
    // Tab system
    // ======================================
    
    // Switch tabs
    function switchTab(tab) {
        // Deactivate all tabs
        [settingsTab, resultsTab, historyTab, favoritesTab].forEach(t => t.classList.remove('active'));
        [settingsContent, resultsContent, historyContent, favoritesContent].forEach(c => c.classList.remove('active'));
        
        // Activate selected tab
        tab.classList.add('active');
        
        // Show corresponding content
        if (tab === settingsTab) {
            settingsContent.classList.add('active');
        } else if (tab === resultsTab) {
            resultsContent.classList.add('active');
        } else if (tab === historyTab) {
            historyContent.classList.add('active');
            renderHistory();
        } else if (tab === favoritesTab) {
            favoritesContent.classList.add('active');
            renderFavorites();
        }
    }
    
    // ======================================
    // Modal handling
    // ======================================
    
    // Open modal
    function openModal(modal) {
        modal.classList.add('active');
    }
    
    // Close modal
    function closeModal(modal) {
        modal.classList.remove('active');
    }
    
    // ======================================
    // Toast notifications
    // ======================================
    
    // Show toast notification
    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'check-circle';
        if (type === 'error') icon = 'times-circle';
        if (type === 'warning') icon = 'exclamation-circle';
        if (type === 'info') icon = 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // ======================================
    // Event Listeners
    // ======================================
    
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Tab switching
    settingsTab.addEventListener('click', () => switchTab(settingsTab));
    resultsTab.addEventListener('click', () => switchTab(resultsTab));
    historyTab.addEventListener('click', () => switchTab(historyTab));
    favoritesTab.addEventListener('click', () => switchTab(favoritesTab));
    
    // Amateur level slider
    amateurLevelInput.addEventListener('input', function() {
        const level = parseInt(this.value);
        let levelText = '';
        
        switch(level) {
            case 1: levelText = 'Subtle'; break;
            case 2: levelText = 'Mild'; break;
            case 3: levelText = 'Moderate'; break;
            case 4: levelText = 'Strong'; break;
            case 5: levelText = 'Extreme'; break;
        }
        
        amateurLevelValue.textContent = levelText;
        appState.amateurLevel = level;
        localStorage.setItem('amateurLevel', level);
    });
    
    // Modal handling
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(aboutModal);
    });
    
    closeAboutModal.addEventListener('click', () => {
        closeModal(aboutModal);
    });
    
    quickSubjectBtn.addEventListener('click', () => {
        openModal(quickSubjectModal);
    });
    
    closeSubjectModal.addEventListener('click', () => {
        closeModal(quickSubjectModal);
    });
    
    // Close modals when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) closeModal(aboutModal);
        if (e.target === quickSubjectModal) closeModal(quickSubjectModal);
    });
    
    // ======================================
    // Initialization
    // ======================================
    
    // Initialize theme
    initTheme();
    
    // Set amateur level from state
    amateurLevelInput.value = appState.amateurLevel;
    amateurLevelValue.textContent = ['Subtle', 'Mild', 'Moderate', 'Strong', 'Extreme'][appState.amateurLevel - 1];
    
    // ======================================
    // History and Favorites handling
    // ======================================
    
    // Save prompt to history
    function saveToHistory(prompt) {
        if (!prompt || !prompt.positive || !prompt.negative) {
            console.error("Invalid prompt data for history");
            return null;
        }
        
        // Initialize history array if it doesn't exist
        if (!Array.isArray(appState.history)) {
            appState.history = [];
        }
        
        const timestamp = new Date().toISOString();
        const historyItem = {
            id: generateId(),
            timestamp: timestamp,
            positive: prompt.positive,
            negative: prompt.negative,
            subjectType: subjectSelect ? subjectSelect.value : "portrait",
            customSubject: customSubjectInput ? customSubjectInput.value.trim() : "",
            location: locationSelect ? locationSelect.value : "home",
            lighting: lightingSelect ? lightingSelect.value : "natural",
            camera: cameraSelect ? cameraSelect.value : "smartphone", 
            mistakes: mistakesSelect ? mistakesSelect.value : "none",
            timePeriod: timePeriodSelect ? timePeriodSelect.value : "none",
            amateurLevel: appState.amateurLevel || 3
        };
        
        // Add to history array
        appState.history.unshift(historyItem);
        
        // Limit history to 50 items
        if (appState.history.length > 50) {
            appState.history = appState.history.slice(0, 50);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('promptHistory', JSON.stringify(appState.history));
        } catch (e) {
            console.error("Error saving to localStorage:", e);
        }
        
        return historyItem;
    }
    
    // Render history list
    function renderHistory() {
        if (!historyList) {
            console.error("History list element not found");
            return;
        }
        
        // Initialize history array if it doesn't exist
        if (!Array.isArray(appState.history)) {
            appState.history = [];
        }
        
        if (appState.history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>Your generated prompts will appear here</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = '';
        
        appState.history.forEach(item => {
            if (!item || !item.id || !item.timestamp) {
                return; // Skip invalid history items
            }
            
            const date = new Date(item.timestamp);
            const formattedDate = isNaN(date.getTime()) ? 
                "Unknown date" : 
                date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            const historyItemEl = document.createElement('div');
            historyItemEl.className = 'history-item';
            historyItemEl.dataset.id = item.id;
            
            const subjectText = item.customSubject || getSubjectDescription(item.subjectType || "portrait");
            const truncatedPrompt = truncateText(item.positive || "No prompt text", 100);
            
            historyItemEl.innerHTML = `
                <div class="history-item-header">
                    <div class="item-title">${subjectText}</div>
                    <div class="item-date">${formattedDate}</div>
                </div>
                <div class="item-content">${truncatedPrompt}</div>
                <div class="item-actions">
                    <button class="icon-btn history-apply-btn" title="Apply settings">
                        <i class="fas fa-sliders-h"></i>
                    </button>
                    <button class="icon-btn history-copy-btn" title="Copy prompt">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="icon-btn history-favorite-btn" title="Add to favorites">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            `;
            
            historyList.appendChild(historyItemEl);
            
            // Add event listeners
            const applyBtn = historyItemEl.querySelector('.history-apply-btn');
            const copyBtn = historyItemEl.querySelector('.history-copy-btn');
            const favoriteBtn = historyItemEl.querySelector('.history-favorite-btn');
            
            if (applyBtn) {
                applyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    applyHistorySettings(item);
                });
            }
            
            if (copyBtn) {
                copyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    copyToClipboard(item.positive || "");
                    showToast('Prompt copied to clipboard');
                });
            }
            
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHistoryFavorite(item);
                    renderHistory(); // Refresh list
                });
            }
            
            // Make the entire item clickable
            historyItemEl.addEventListener('click', () => {
                loadPromptFromHistory(item);
                if (resultsTab) {
                    switchTab(resultsTab);
                }
            });
        });
    }
    
    // Render favorites list
    function renderFavorites() {
        if (!favoritesList) {
            console.error("Favorites list element not found");
            return;
        }
        
        // Initialize favorites array if it doesn't exist
        if (!Array.isArray(appState.favorites)) {
            appState.favorites = [];
        }
        
        if (appState.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>Your favorite prompts will appear here</p>
                </div>
            `;
            return;
        }
        
        favoritesList.innerHTML = '';
        
        appState.favorites.forEach(item => {
            if (!item || !item.id || !item.timestamp) {
                return; // Skip invalid favorite items
            }
            
            const date = new Date(item.timestamp);
            const formattedDate = isNaN(date.getTime()) ? 
                "Unknown date" : 
                date.toLocaleDateString();
            
            const favoriteItemEl = document.createElement('div');
            favoriteItemEl.className = 'favorite-item';
            favoriteItemEl.dataset.id = item.id;
            
            const titleText = item.title || 'Untitled Prompt';
            const truncatedPrompt = truncateText(item.positive || "No prompt text", 100);
            
            favoriteItemEl.innerHTML = `
                <div class="favorite-item-header">
                    <div class="item-title">${titleText}</div>
                    <div class="item-date">${formattedDate}</div>
                </div>
                <div class="item-content">${truncatedPrompt}</div>
                <div class="item-actions">
                    <button class="icon-btn favorite-copy-btn" title="Copy prompt">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="icon-btn favorite-remove-btn" title="Remove from favorites">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            favoritesList.appendChild(favoriteItemEl);
            
            // Add event listeners
            const copyBtn = favoriteItemEl.querySelector('.favorite-copy-btn');
            const removeBtn = favoriteItemEl.querySelector('.favorite-remove-btn');
            
            if (copyBtn) {
                copyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    copyToClipboard(item.positive || "");
                    showToast('Prompt copied to clipboard');
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFavorite(item.id);
                });
            }
            
            // Make the entire item clickable
            favoriteItemEl.addEventListener('click', () => {
                if (positiveOutput && negativeOutput) {
                    positiveOutput.value = item.positive || "";
                    negativeOutput.value = item.negative || "";
                    
                    // Set current prompt
                    appState.currentPrompt = {
                        positive: item.positive || "",
                        negative: item.negative || ""
                    };
                    
                    // Update favorite button
                    updateFavoriteButtonState();
                    
                    // Switch to results tab
                    if (resultsTab) {
                        switchTab(resultsTab);
                    }
                }
            });
        });
    }
    
    // Generate random ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    // Truncate text
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Get readable subject description
    function getSubjectDescription(subjectType) {
        const subjects = {
            'portrait': 'Portrait',
            'landscape': 'Landscape',
            'street': 'Street Scene',
            'food': 'Food Photo',
            'pet': 'Pet Photo',
            'family': 'Family Photo',
            'travel': 'Travel Scene',
            'event': 'Event Photo',
            'nature': 'Nature Photo',
            'object': 'Object Photo',
            'sport': 'Sports Photo',
            'vehicle': 'Vehicle Photo',
            'selfie': 'Selfie',
            'child': 'Child Photo',
            'beach': 'Beach Photo',
            'night': 'Night Scene',
            'concert': 'Concert Photo',
            'party': 'Party Photo',
            'graduation': 'Graduation Photo',
            'wedding': 'Wedding Photo'
        };
        
        return subjects[subjectType] || 'Photo';
    }
    
    // Toggle favorite status for history item
    function toggleHistoryFavorite(historyItem) {
        if (!historyItem) return;
        
        const existingIndex = appState.favorites.findIndex(item => 
            item.positive === historyItem.positive && 
            item.negative === historyItem.negative
        );
        
        if (existingIndex === -1) {
            // Add to favorites
            const favoriteItem = {
                id: generateId(),
                timestamp: new Date().toISOString(),
                positive: historyItem.positive,
                negative: historyItem.negative,
                title: historyItem.customSubject || getSubjectDescription(historyItem.subjectType)
            };
            
            appState.favorites.unshift(favoriteItem);
            localStorage.setItem('promptFavorites', JSON.stringify(appState.favorites));
            showToast('Added to favorites!');
        } else {
            // Remove from favorites
            appState.favorites.splice(existingIndex, 1);
            localStorage.setItem('promptFavorites', JSON.stringify(appState.favorites));
            showToast('Removed from favorites');
        }
        
        // Refresh favorites list if visible
        if (favoritesContent && favoritesContent.classList.contains('active')) {
            renderFavorites();
        }
    }
    
    // Apply settings from history item
    function applyHistorySettings(item) {
        if (!item) return;
        
        // Apply all the settings
        if (subjectSelect) subjectSelect.value = item.subjectType || 'portrait';
        if (customSubjectInput) customSubjectInput.value = item.customSubject || '';
        if (locationSelect) locationSelect.value = item.location || 'home';
        if (lightingSelect) lightingSelect.value = item.lighting || 'natural';
        if (cameraSelect) cameraSelect.value = item.camera || 'smartphone';
        if (mistakesSelect) mistakesSelect.value = item.mistakes || 'none';
        if (timePeriodSelect) timePeriodSelect.value = item.timePeriod || 'none';
        
        // Set amateur level
        if (item.amateurLevel && amateurLevelInput) {
            amateurLevelInput.value = item.amateurLevel;
            if (amateurLevelValue) {
                amateurLevelValue.textContent = ['Subtle', 'Mild', 'Moderate', 'Strong', 'Extreme'][item.amateurLevel - 1];
            }
            appState.amateurLevel = item.amateurLevel;
            localStorage.setItem('amateurLevel', item.amateurLevel);
        }
        
        // Switch to settings tab
        switchTab(settingsTab);
        showToast('Settings applied', 'info');
    }
    
    // Load prompt from history
    function loadPromptFromHistory(item) {
        if (!item) return;
        
        if (positiveOutput) positiveOutput.value = item.positive || '';
        if (negativeOutput) negativeOutput.value = item.negative || '';
        
        // Set current prompt
        appState.currentPrompt = {
            positive: item.positive || '',
            negative: item.negative || ''
        };
        
        // Update favorite button
        updateFavoriteButtonState();
    }
    
    // Remove favorite
    function removeFavorite(id) {
        if (!id) return;
        
        const index = appState.favorites.findIndex(item => item.id === id);
        
        if (index !== -1) {
            appState.favorites.splice(index, 1);
            localStorage.setItem('promptFavorites', JSON.stringify(appState.favorites));
            renderFavorites();
            showToast('Removed from favorites');
            
            // Update favorite button if current prompt is affected
            updateFavoriteButtonState();
        }
    }
    
    // Toggle favorite status
    function toggleFavorite() {
        if (!appState.currentPrompt) {
            console.log("No current prompt to favorite");
            return;
        }
        
        // Initialize favorites array if it doesn't exist
        if (!Array.isArray(appState.favorites)) {
            appState.favorites = [];
        }
        
        const existingIndex = appState.favorites.findIndex(item => 
            item && item.positive === appState.currentPrompt.positive && 
            item.negative === appState.currentPrompt.negative
        );
        
        if (existingIndex === -1) {
            // Add to favorites
            const favoriteItem = {
                id: generateId(),
                timestamp: new Date().toISOString(),
                positive: appState.currentPrompt.positive,
                negative: appState.currentPrompt.negative,
                title: customSubjectInput && customSubjectInput.value ? customSubjectInput.value.trim() : 
                      (subjectSelect ? getSubjectDescription(subjectSelect.value) : "Untitled Prompt")
            };
            
            appState.favorites.unshift(favoriteItem);
            localStorage.setItem('promptFavorites', JSON.stringify(appState.favorites));
            
            // Update UI
            if (favoriteBtn) {
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
                showToast('Added to favorites!');
            }
        } else {
            // Remove from favorites
            appState.favorites.splice(existingIndex, 1);
            localStorage.setItem('promptFavorites', JSON.stringify(appState.favorites));
            
            // Update UI
            if (favoriteBtn) {
                favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
                showToast('Removed from favorites');
            }
        }
        
        // Refresh favorites list if visible
        if (favoritesContent && favoritesContent.classList.contains('active') && favoritesList) {
            renderFavorites();
        }
    }
    
    // Update favorite button state
    function updateFavoriteButtonState() {
        if (!favoriteBtn) {
            console.log("Favorite button not found");
            return;
        }
        
        if (!appState.currentPrompt) {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            return;
        }
        
        // Initialize favorites array if it doesn't exist
        if (!Array.isArray(appState.favorites)) {
            appState.favorites = [];
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            return;
        }
        
        const isFavorite = appState.favorites.some(item => 
            item && item.positive === appState.currentPrompt.positive && 
            item.negative === appState.currentPrompt.negative
        );
        
        favoriteBtn.innerHTML = isFavorite ? 
            '<i class="fas fa-heart"></i>' : 
            '<i class="far fa-heart"></i>';
    }
    
    // ======================================
    // Quick Subject Grid
    // ======================================
    
    // Populate quick subject grid
    function populateQuickSubjectGrid() {
        if (!quickSubjectGrid) {
            console.error("Quick subject grid element not found");
            return;
        }
        
        quickSubjectGrid.innerHTML = '';
        
        // Add some predefined quick subjects
        const quickSubjects = [
            'dog', 'cat', 'bird', 'child playing', 'family dinner',
            'sunset', 'beach day', 'birthday party', 'road trip',
            'backyard', 'kitchen', 'bathroom selfie', 'graduation',
            'vacation', 'old car', 'picnic', 'hiking', 'camping',
            'Christmas morning', 'wedding', 'concert', 'sporting event',
            'grocery store', 'restaurant meal', 'coffee shop'
        ];
        
        // Add a button for each quick subject
        quickSubjects.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'subject-btn';
            btn.textContent = subject;
            
            btn.addEventListener('click', () => {
                if (customSubjectInput) {
                    customSubjectInput.value = subject;
                }
                if (quickSubjectModal) {
                    closeModal(quickSubjectModal);
                }
            });
            
            quickSubjectGrid.appendChild(btn);
        });
    }
    
    // ======================================
    // Utility Functions
    // ======================================
    
    // Get random item from array
    function getRandomItem(array) {
        if (!array || !Array.isArray(array) || array.length === 0) {
            console.warn("Invalid array provided to getRandomItem");
            return "random item";
        }
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Safely get a random item from a category in promptData
    function getSafeRandomItem(category, key, fallbacks = ["random item"]) {
        if (!promptData || !promptData[category] || !promptData[category][key] || 
            !Array.isArray(promptData[category][key]) || promptData[category][key].length === 0) {
            console.warn(`Missing prompt data for ${category}.${key}, using fallback`);
            return getRandomItem(fallbacks);
        }
        return getRandomItem(promptData[category][key]);
    }
    
    // Set random selections for all dropdowns
    function setRandomSelections() {
        const subjects = Object.keys(promptData.subject);
        const locations = Object.keys(promptData.location);
        const lightings = Object.keys(promptData.lighting);
        const cameras = Object.keys(promptData.camera);
        const mistakesOptions = Object.keys(promptData.mistakes);
        const timePeriods = Object.keys(promptData.timePeriod);
        
        subjectSelect.value = getRandomItem(subjects);
        locationSelect.value = getRandomItem(locations);
        lightingSelect.value = getRandomItem(lightings);
        cameraSelect.value = getRandomItem(cameras);
        mistakesSelect.value = getRandomItem(mistakesOptions);
        timePeriodSelect.value = getRandomItem(timePeriods);
        
        // Don't clear custom subject when randomizing
        // customSubjectInput.value = '';
    }
    
    // Generate prompt based on selections
    function generatePrompt() {
        console.log("Generating prompt...");
        
        // Verify all required DOM elements and data exist
        if (!subjectSelect || !locationSelect || !lightingSelect || 
            !cameraSelect || !mistakesSelect || !timePeriodSelect || 
            !customSubjectInput || !promptData) {
            console.error("Missing required elements or data for prompt generation");
            showToast("Error generating prompt. Please reload the page.", "error");
            return {
                positive: "Error generating prompt. Please reload the page.",
                negative: ""
            };
        }
        
        // Get current selections
        const subject = subjectSelect.value;
        const location = locationSelect.value;
        const lighting = lightingSelect.value;
        const camera = cameraSelect.value;
        const mistake = mistakesSelect.value;
        const timePeriod = timePeriodSelect.value;
        const customSubject = customSubjectInput.value.trim();
        const amateurLevel = appState.amateurLevel || 3; // Default to moderate if not set
        
        console.log("Selected:", subject, location, lighting, camera, mistake, timePeriod, "Amateur Level:", amateurLevel);
        
        // Verify data exists for all selections
        if (!promptData.subject[subject] || !promptData.location[location] || 
            !promptData.lighting[lighting] || !promptData.camera[camera] || 
            !promptData.mistakes[mistake] || !promptData.timePeriod[timePeriod]) {
            console.error("Missing prompt data for selections");
            showToast("Error with prompt data. Using defaults.", "warning");
        }
        
        // Safely get random descriptions for each category
        const subjectDesc = customSubject || 
            getRandomItem(promptData.subject[subject] || ["person", "photo subject"]);
        
        // Determine flash lighting probability based on amateur level
        let lightingDesc;
        const flashProbability = 0.3 + (amateurLevel * 0.1); // 40% to 80% chance based on level
        const useFlash = Math.random() < flashProbability;
        
        if (useFlash) {
            const flashOptions = [
                'harsh direct flash', 'washed out faces from flash', 'bright flash in dark room',
                'uneven flash lighting', 'reflective flash', 'obvious flash photography',
                'flash reflection in window', 'blinding flash', 'overlit flash', 'flash shadows',
                'flash on auto', 'flash too close', 'flash in daylight', 'red-eye causing flash',
                'camera flash glare', 'bright flash spots', 'harsh shadows from flash',
                'flash lighting falloff', 'flash in mirror', 'unflattering flash',
                'blown out flash', 'direct flash', 'amateur flash'
            ];
            lightingDesc = getRandomItem(flashOptions);
        } else {
            lightingDesc = getRandomItem(promptData.lighting[lighting] || ["poor lighting", "amateur lighting"]);
        }
        
        // Determine phone camera probability based on amateur level
        let cameraDesc;
        const phoneProbability = 0.5 + (amateurLevel * 0.1); // 60% to 100% chance based on level
        const usePhone = Math.random() < phoneProbability;
        
        if (usePhone) {
            const phoneOptions = [
                'old phone camera', 'early smartphone camera', 'flip phone camera', '2007 phone camera',
                'outdated phone camera', 'low resolution phone camera', 'early camera phone',
                'primitive phone camera', 'first generation iPhone camera', 'basic phone camera',
                'obsolete phone camera', 'cheap phone camera', 'early Android phone camera',
                'limited phone camera', 'pixelated phone photo', 'tiny phone sensor', 'noisy phone camera',
                'pre-smartphone camera', 'low quality mobile camera', '2000s phone camera',
                'outdated mobile photography', 'small phone sensor', 'early camera phone sensor'
            ];
            cameraDesc = getRandomItem(phoneOptions);
        } else {
            cameraDesc = getRandomItem(promptData.camera[camera] || ["cheap camera", "basic camera"]);
        }
        
        const locationDesc = getRandomItem(promptData.location[location] || ["indoor location", "outdoor location"]);
        
        // Determine multiple mistakes based on amateur level
        let mistakeDesc = '';
        const numMistakes = Math.min(1 + Math.floor(amateurLevel / 2), 3); // 1 to 3 mistakes based on level
        
        if (useFlash && Math.random() < 0.6) {
            // Include red-eye when flash is used
            const redEyeOptions = [
                'red eye effect', 'flash reflection in eyes', 'glowing eyes from flash',
                'red eye', 'flash eye reflection', 'demonic red eyes',
                'red pupil effect', 'red-eye phenomenon', 'crimson eye reflection',
                'red-eye from flash', 'eyes glowing red', 'red eye artifact'
            ];
            mistakeDesc = getRandomItem(redEyeOptions);
            
            // Add additional mistakes if needed
            if (numMistakes > 1) {
                const additionalMistakes = [];
                const mistakeOptions = Object.keys(promptData.mistakes).filter(m => m !== 'none' && m !== 'red-eye');
                
                for (let i = 0; i < numMistakes - 1 && mistakeOptions.length > 0; i++) {
                    const randomMistake = getRandomItem(mistakeOptions);
                    additionalMistakes.push(getRandomItem(promptData.mistakes[randomMistake] || ["technical error"]));
                    
                    // Remove the selected mistake to avoid duplicates
                    const index = mistakeOptions.indexOf(randomMistake);
                    if (index > -1) {
                        mistakeOptions.splice(index, 1);
                    }
                }
                
                mistakeDesc += ', ' + additionalMistakes.join(', ');
            }
        } else if (mistake === 'none' || numMistakes > 1) {
            // If none was selected or we need multiple mistakes, pick random ones
            const mistakeOptions = Object.keys(promptData.mistakes).filter(m => m !== 'none');
            const selectedMistakes = [];
            
            for (let i = 0; i < numMistakes && mistakeOptions.length > 0; i++) {
                const randomMistake = getRandomItem(mistakeOptions);
                selectedMistakes.push(getRandomItem(promptData.mistakes[randomMistake] || ["photographic mistake"]));
                
                // Remove the selected mistake to avoid duplicates
                const index = mistakeOptions.indexOf(randomMistake);
                if (index > -1) {
                    mistakeOptions.splice(index, 1);
                }
                
                // Break if we've used all available mistakes
                if (mistakeOptions.length === 0) break;
            }
            
            mistakeDesc = selectedMistakes.join(', ');
        } else {
            // Just use the selected mistake
            mistakeDesc = getRandomItem(promptData.mistakes[mistake] || ["camera mistake"]);
        }
        
        // Maybe add a time period (if not 'none')
        let timePeriodDesc = '';
        if (timePeriod !== 'none') {
            timePeriodDesc = getRandomItem(promptData.timePeriod[timePeriod]);
        } else if (usePhone) {
            // If using old phone camera and no time period specified, add a relevant era
            const phoneEras = [
                '2000s digital photo quality', 'early 2000s digital',
                'first digital camera phone era', 'early JPEG compression',
                'low resolution digital era', 'early consumer digital',
                'primitive digital camera era', 'early 2000s camera phone',
                'first camera phone photo era', 'social media phone camera era',
                'pre-smartphone era', 'flip-phone era'
            ];
            timePeriodDesc = getRandomItem(phoneEras);
        }
        
        // Get random style modifier
        const styleModifier = getRandomItem(promptData.styles);
        
        // Add more amateur qualifiers with emphasis on phone/flash issues
        const amateurQualifiers = [
            'low quality', 'amateurish', 'unprofessionally shot', 'mediocre quality',
            'everyday person photography', 'unedited', 'untrained photography',
            'basic photography', 'unskilled composition', 'poorly composed',
            'typical amateur result', 'bad lighting', 'poor technique',
            'low effort photo', 'ordinary snapshot', 'non-professional quality',
            'typical phone photo', 'poor focus', 'over-compressed',
            'jpeg artifacts', 'digital noise', 'poor color balance',
            'dated digital look', 'compression artifacts',
            'over-saturated colors', 'unskilled photographer',
            'poor white balance', 'unsteady shooting',
            'random snapshot', 'over-exposed', 'pixel noise', 
            'low resolution', 'pixelated', 'awkward composition',
            'insufficient lighting', 'improper focus', 'unbalanced composition',
            'photographic mistakes', 'technical errors', 'unnatural colors',
            'auto mode', 'incorrect settings', 'beginner photography',
            'unsophisticated', 'unprepared shot', 'hasty capture',
            'unflattering perspective', 'bad cropping', 'dull colors',
            'noisy image', 'overexposure', 'underexposure',
            'sensor limitations', 'cheap optics', 'flat lighting',
            'chromatic aberration', 'lens distortion', 'poor sensor',
            'wrong ISO setting', 'poor dynamic range', 'limited megapixels',
            'color fringing', 'sensor noise', 'muddy details'
        ];
        
        // Number of qualifiers based on amateur level
        const numQualifiers = Math.min(amateurLevel + 1, 5);
        const selectedQualifiers = [];
        
        for (let i = 0; i < numQualifiers; i++) {
            const qualifier = getRandomItem(amateurQualifiers);
            if (!selectedQualifiers.includes(qualifier)) {
                selectedQualifiers.push(qualifier);
            }
        }
        
        // Build the basic prompt
        let promptText = `${subjectDesc}, ${locationDesc}, ${lightingDesc}, ${cameraDesc}, ${mistakeDesc}`;
        
        // Add time period if present
        if (timePeriodDesc) {
            promptText += `, ${timePeriodDesc}`;
        }
        
        // Add style modifier
        promptText += `, ${styleModifier}`;
        
        // Add amateur qualifiers
        promptText += `, ${selectedQualifiers.join(", ")}`;
        
        // Add specific amateur photographer qualifiers based on amateur level
        if (Math.random() < 0.4 + (amateurLevel * 0.1)) {
            const extraQualifiers = [
                'photo taken by someone who doesn\'t know how to use a camera',
                'obviously amateur photographer',
                'badly framed photo',
                'typical family photo',
                'random person photography',
                'unflattering angle',
                'grandparent taking photo',
                'child taking photo',
                'rushed snapshot',
                'accidental photo',
                'not knowing how to hold camera steady',
                'first time using camera',
                'tourist photography',
                'casual snapshot',
                'taken by untrained person'
            ];
            promptText += `, ${getRandomItem(extraQualifiers)}`;
        }
        
        // Format for RealisticVisionV60B1_v51HyperVAE model
        // Format depends on amateur level
        let finalPrompt = '';
        
        if (amateurLevel <= 2) {
            // Subtle to mild amateur look - add some quality terms but still keep amateur feel
            finalPrompt = `a photograph of ${promptText}, (amateur photography:1.2), (low quality:1.1), photorealistic, 35mm film photography`;
            
            // Add a few negative weighted professional terms
            const subtleNegTerms = [
                '(professional photography:-0.5)', 
                '(high resolution:-0.3)', 
                '(perfect focus:-0.3)'
            ];
            
            const numNegTerms = Math.min(amateurLevel, 2);
            const selectedNegTerms = [];
            
            for (let i = 0; i < numNegTerms; i++) {
                selectedNegTerms.push(subtleNegTerms[i]);
            }
            
            finalPrompt += `, ${selectedNegTerms.join(", ")}`;
        } 
        else if (amateurLevel <= 4) {
            // Moderate to strong amateur look
            finalPrompt = `a photograph of ${promptText}, (amateur photography:1.4), (low quality photograph:1.3), (poor quality:1.2), (unsophisticated:1.2), photorealistic`;
            
            // Add negative weighted professional terms
            const moderateNegTerms = [
                '(professional photography:-0.8)', 
                '(award winning photography:-0.8)', 
                '(high resolution:-0.6)', 
                '(detailed:-0.4)', 
                '(sharp focus:-0.6)',
                '(proper exposure:-0.7)'
            ];
            
            const numNegTerms = Math.min(amateurLevel, 4);
            const selectedNegTerms = [];
            
            for (let i = 0; i < numNegTerms; i++) {
                selectedNegTerms.push(moderateNegTerms[i]);
            }
            
            finalPrompt += `, ${selectedNegTerms.join(", ")}`;
        }
        else {
            // Extreme amateur look
            finalPrompt = `a photograph of ${promptText}, (amateur photography:1.6), (low quality photograph:1.5), (poor quality:1.4), (bad photography:1.3), (unskilled photography:1.3)`;
            
            // Add stronger negative weighted professional terms
            const extremeNegTerms = [
                '(professional photography:-1)', 
                '(award winning photography:-1)', 
                '(high resolution:-0.9)', 
                '(detailed:-0.7)', 
                '(sharp focus:-0.9)',
                '(proper exposure:-0.9)',
                '(well composed:-1)',
                '(good lighting:-0.8)'
            ];
            
            const numNegTerms = Math.min(5, extremeNegTerms.length);
            const selectedNegTerms = [];
            
            for (let i = 0; i < numNegTerms; i++) {
                selectedNegTerms.push(extremeNegTerms[i]);
            }
            
            finalPrompt += `, ${selectedNegTerms.join(", ")}`;
        }
        
        // Add negative prompt - strength based on amateur level
        const negatives = [
            // Core negatives that should always be included
            'professional', 'professional quality', 'DSLR', 'studio lighting', 'perfect composition', 
            'expert photography', 'high-end', 'commercial quality', 'professional editing', 
            'magazine quality', 'stock photo', 'perfect exposure', 'award winning',
            'high resolution', 'perfect focus', 'artistic composition', 'professional photographer', 
            'photographic excellence', 'skillful', 'professional color grading', 'expert', 'well composed',
            'perfect', 'detailed', 'high detail', 'studio quality', 'professional gear', 'professional camera',
            'professional portrait', 'masterfully composed', 'expert lighting', 'commercial photography',
            'well lit', 'professional equipment', 'studio setup', 'high quality', 'sharp focus',
            'professional framing', 'modern digital camera', 'professional stabilization', 'expert skills',
            'correct exposure', 'properly framed', 'high-end camera', 'beautiful composition',
            'artistic', 'editorial', 'expert technique', 'skillfully taken', 'professional color',
            'professional post-processing', 'photography expertise',
            
            // RealisticVision model specific negatives - these help avoid AI-specific issues
            'deformed iris', 'deformed pupils', 'semi-realistic', 'cgi', '3d render', 'cartoon', 'anime', 
            'digital art', 'illustration', 'painting', 'text', 'watermark', 'signature',
            'mutated hands', 'mutated fingers', 'disfigured', 'extra limbs', 'extra fingers',
            'out of frame', 'cropped image', 'multiple people',
            'unnatural anatomy', 'bad proportions', 'misshapen body', 'duplicate',
            'ugly', 'poorly drawn face', 'mutation', 'deformed',
            'bad anatomy', 'disfigured', 'poorly drawn hands', 'missing limbs',
            'floating limbs', 'disconnected limbs', 'malformed hands', 'distorted face',
            'shiny skin', 'uneven skin tone', 'glowing skin',
            'symmetrical', 'centered composition', 'rule of thirds',
            'bokeh', 'shallow depth of field', 'studio', 'clean', 'detailed skin'
        ];
        
        // Only add 'blurry' to negatives if not explicitly part of the prompt
        if (!promptText.includes('blurry') && !promptText.includes('blur')) {
            negatives.push('blurry', 'blurred');
        }
        
        // Always include all core negatives
        const negativePrompt = negatives.join(", ");
        
        console.log("Generated positive:", finalPrompt);
        console.log("Generated negative:", negativePrompt);
        
        // Save to history
        appState.currentPrompt = {
            positive: finalPrompt,
            negative: negativePrompt
        };
        
        // Save to history
        const historyItem = saveToHistory(appState.currentPrompt);
        
        // Update favorite button state
        updateFavoriteButtonState();
        
        // Final prompt
        return {
            positive: finalPrompt,
            negative: negativePrompt
        };
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
    }
    
    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        console.log("Generate button clicked");
        try {
            const prompt = generatePrompt();
            
            if (prompt && positiveOutput && negativeOutput) {
                positiveOutput.value = prompt.positive;
                negativeOutput.value = prompt.negative;
                
                // Auto copy positive prompt to clipboard
                copyToClipboard(prompt.positive);
                showToast('Prompt generated and copied to clipboard');
                
                // Switch to results tab
                if (resultsTab) {
                    switchTab(resultsTab);
                }
            } else {
                showToast('Error generating prompt. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Error in generate button handler:", error);
            showToast('Error generating prompt. Please try again.', 'error');
        }
    });
    
    // Random button click handler
    randomBtn.addEventListener('click', function() {
        console.log("Random button clicked");
        try {
            // Save custom subject before randomizing
            const customSubject = customSubjectInput ? customSubjectInput.value.trim() : '';
            
            setRandomSelections();
            
            // Restore custom subject if it exists
            if (customSubject && customSubjectInput) {
                customSubjectInput.value = customSubject;
            }
            
            const prompt = generatePrompt();
            
            if (prompt && positiveOutput && negativeOutput) {
                positiveOutput.value = prompt.positive;
                negativeOutput.value = prompt.negative;
                
                // Auto copy positive prompt to clipboard
                copyToClipboard(prompt.positive);
                showToast('Random prompt generated and copied');
                
                // Switch to results tab
                if (resultsTab) {
                    switchTab(resultsTab);
                }
            } else {
                showToast('Error generating prompt. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Error in random button handler:", error);
            showToast('Error generating random prompt. Please try again.', 'error');
        }
    });
    
    // Copy positive prompt button handler
    copyPositiveBtn.addEventListener('click', function() {
        copyToClipboard(positiveOutput.value);
        showToast('Positive prompt copied!');
    });
    
    // Copy negative prompt button handler
    copyNegativeBtn.addEventListener('click', function() {
        copyToClipboard(negativeOutput.value);
        showToast('Negative prompt copied!');
    });
    
    // Copy all button click handler
    copyAllBtn.addEventListener('click', function() {
        const allText = positiveOutput.value + '\n\nNegative prompt: ' + negativeOutput.value;
        copyToClipboard(allText);
        showToast('All prompts copied!');
    });
    
    // Send to Stable Diffusion button handler
    sendToSdBtn.addEventListener('click', function() {
        // Different implementations based on where Stable Diffusion is running
        const promptData = {
            prompt: positiveOutput.value,
            negative_prompt: negativeOutput.value
        };
        
        // First try local API endpoints common for SD WebUI
        tryWebUIEndpoint(promptData);
    });
    
    // Try to send to Stable Diffusion WebUI
    async function tryWebUIEndpoint(promptData) {
        // Check for common local SD WebUI endpoints
        const possibleEndpoints = [
            'http://127.0.0.1:7860/sdapi/v1/txt2img',
            'http://localhost:7860/sdapi/v1/txt2img'
        ];
        
        let success = false;
        
        for (const endpoint of possibleEndpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'OPTIONS',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok || response.status === 204) {
                    // Endpoint appears to be available, show confirmation
                    const confirmed = confirm('Stable Diffusion WebUI detected! Send prompt to generate image?');
                    
                    if (confirmed) {
                        // Construct full payload for WebUI
                        const payload = {
                            prompt: promptData.prompt,
                            negative_prompt: promptData.negative_prompt,
                            steps: 30,
                            cfg_scale: 7,
                            width: 768,
                            height: 768,
                            sampler_name: "DPM++ 2M Karras"
                        };
                        
                        try {
                            showToast('Sending to Stable Diffusion...', 'info');
                            
                            const generateResponse = await fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            });
                            
                            if (generateResponse.ok) {
                                showToast('Prompt sent to Stable Diffusion successfully!', 'success');
                                success = true;
                                break;
                            } else {
                                throw new Error('Failed to send prompt');
                            }
                        } catch (error) {
                            console.error('Error sending to SD WebUI:', error);
                            showToast('Error connecting to Stable Diffusion', 'error');
                        }
                    }
                    
                    success = true;
                    break;
                }
            } catch (error) {
                console.log('Endpoint not available:', endpoint);
            }
        }
        
        // If no endpoints worked, offer alternative methods
        if (!success) {
            // Show instructions for manual copy
            const message = `No Stable Diffusion API detected. To use this prompt:
            
1. Copy the prompts using the copy buttons
2. Paste them into your Stable Diffusion interface
3. Use the RealisticVisionV60B1_v51HyperVAE model for best results`;

            alert(message);
        }
    }
    
    // Initial prompt generation
    console.log("Initializing prompt generator");
    try {
        // Don't auto-generate on page load to avoid confusing users
        // Just initialize the UI
        console.log("Initial UI set up");
        
        // Verify all required elements exist
        const requiredElements = {
            'theme-toggle-btn': themeToggleBtn,
            'generate-btn': generateBtn,
            'random-btn': randomBtn,
            'copy-all-btn': copyAllBtn,
            'copy-positive-btn': copyPositiveBtn,
            'copy-negative-btn': copyNegativeBtn,
            'positive-output': positiveOutput,
            'negative-output': negativeOutput,
            'custom-subject': customSubjectInput,
            'amateur-level': amateurLevelInput,
            'amateur-level-value': amateurLevelValue,
            'settings-tab': settingsTab,
            'results-tab': resultsTab,
            'history-tab': historyTab,
            'favorites-tab': favoritesTab,
            'settings-content': settingsContent,
            'results-content': resultsContent,
            'history-content': historyContent,
            'favorites-content': favoritesContent,
            'favorite-btn': favoriteBtn,
            'history-list': historyList,
            'favorites-list': favoritesList,
            'subject': subjectSelect,
            'location': locationSelect,
            'lighting': lightingSelect,
            'camera': cameraSelect,
            'mistakes': mistakesSelect,
            'time-period': timePeriodSelect
        };
        
        const missingElements = [];
        
        for (const [id, element] of Object.entries(requiredElements)) {
            if (!element) {
                missingElements.push(id);
                console.error(`Missing required element: ${id}`);
            }
        }
        
        if (missingElements.length > 0) {
            console.error(`Missing ${missingElements.length} required elements: ${missingElements.join(', ')}`);
        } else {
            console.log("All required elements found");
        }
        
        // Setup missing data if needed
        if (!promptData) {
            console.error("promptData is not defined! Application will not work properly.");
        }
        
        // Setup event listeners for clear buttons
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear all history?')) {
                    appState.history = [];
                    localStorage.setItem('promptHistory', '[]');
                    renderHistory();
                    showToast('History cleared');
                }
            });
        }
        
        if (clearFavoritesBtn) {
            clearFavoritesBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear all favorites?')) {
                    appState.favorites = [];
                    localStorage.setItem('promptFavorites', '[]');
                    renderFavorites();
                    showToast('Favorites cleared');
                }
            });
        }
        
        // Add favorite button event listener
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', toggleFavorite);
        }
        
        // Initialize UI
        if (promptData) {
            console.log("Initializing quick subject grid");
            populateQuickSubjectGrid();
        }
        
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}); 