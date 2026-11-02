# Send out Coupon Codes to all users:

cd "/Users/patrickhutchinson/Desktop/Work/A Projects/ZX GITHUB REPOS/pinea/app"

rm -rf /tmp/pinea-send-codes-check
./node_modules/.bin/tsc --target ES2022 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --outDir /tmp/pinea-send-codes-check \
 src/app/scripts/send-codes/send-codes.ts \
 src/lib/membership-redemption.ts

NODE_PATH="$PWD/node_modules" node --env-file=.env \
 /tmp/pinea-send-codes-check/app/scripts/send-codes/send-codes.js \
 --send \
 --confirm-send-codes
