'use strict';

const { Plugin } = require('obsidian');

module.exports = class MyPathModifierPlugin extends Plugin {
    async onload() {
        console.log('MyPathModifierPlugin: Loaded');
        this.app.workspace.onLayoutReady(() => {
            this.initializeMutationObserver();
        });
    }

    initializeMutationObserver() {
        const mutationObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (addedNode.classList.contains('canvas-display-path') || addedNode.classList.contains('canvas-interaction-path')){
                            this.setupPathElementMutationObserver(addedNode);
                        }
                    });
                }
            });
        });


        mutationObserver.observe(document, { childList: true, subtree: true });
    }

    setupPathElementMutationObserver(pathElement) {
        const mutationObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'd' &&
                    mutation.target.getAttribute('d') !== mutation.oldValue
                ) {
                    this.modifyPathAttribute(pathElement);
                }
            }
        });

        mutationObserver.observe(pathElement, {
            attributes: true,
            attributeFilter: ['d'],
            attributeOldValue: true,
        });
    }

    modifyPathAttribute(pathElement) {
        let currentDValue = pathElement.getAttribute('d');
        currentDValue = currentDValue.replace(/C/g, '');
        pathElement.setAttribute('d', currentDValue);
    }
};
