// src/controllers/homeController.js
import { getWelcomeMessage } from '../models/data.js';
import { createAppHtml } from '../views/appView.js';

export function getHomePageContent() {
    const message = getWelcomeMessage();
    return createAppHtml(message);
}