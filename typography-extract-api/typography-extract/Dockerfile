# Pin this tag to the same major.minor.patch as the "playwright" package in package.json
# so bundled browsers match the installed npm package.
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
# Use browsers shipped with the official Playwright image (see Railway Playwright guide).
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
EXPOSE 8080

CMD ["node", "index.js"]
