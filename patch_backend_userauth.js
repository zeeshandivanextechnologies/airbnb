const fs = require('fs');
const filePath = 'backend/src/routes/userAuth.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. In router.get('/profile', add pro_hosting_tools, custom_profile_url in SELECT queries
content = content.replace(
  `automatic_translation, preferred_currency\n         FROM users WHERE id = $1`,
  `automatic_translation, preferred_currency, pro_hosting_tools, custom_profile_url\n         FROM users WHERE id = $1`
);

content = content.replace(
  `automatic_translation, preferred_currency\n          FROM users WHERE LOWER(email) = LOWER($1)`,
  `automatic_translation, preferred_currency, pro_hosting_tools, custom_profile_url\n          FROM users WHERE LOWER(email) = LOWER($1)`
);

// In router.get('/profile' response JSON:
content = content.replace(
  `preferredCurrency: user.preferred_currency || 'INR'`,
  `preferredCurrency: user.preferred_currency || 'INR',\n        proHostingTools: !!user.pro_hosting_tools,\n        customProfileUrl: user.custom_profile_url || ''`
);

// 2. In router.put('/profile', destructure proHostingTools, customProfileUrl
content = content.replace(
  `automaticTranslation,\n    preferredCurrency`,
  `automaticTranslation,\n    preferredCurrency,\n    proHostingTools,\n    customProfileUrl`
);

// In fields.push
content = content.replace(
  `if (preferredCurrency !== undefined) { fields.push(\`preferred_currency = $\${idx++}\`); values.push(preferredCurrency); }`,
  `if (preferredCurrency !== undefined) { fields.push(\`preferred_currency = $\${idx++}\`); values.push(preferredCurrency); }\n    if (proHostingTools !== undefined) { fields.push(\`pro_hosting_tools = $\${idx++}\`); values.push(proHostingTools); }\n    if (customProfileUrl !== undefined) { fields.push(\`custom_profile_url = $\${idx++}\`); values.push(customProfileUrl.trim()); }`
);

// In RETURNING clause
content = content.replace(
  `automatic_translation, preferred_currency\n    \`;`,
  `automatic_translation, preferred_currency, pro_hosting_tools, custom_profile_url\n    \`;`
);

// In put response JSON:
content = content.replace(
  `preferredCurrency: updatedUser.preferred_currency || 'INR'`,
  `preferredCurrency: updatedUser.preferred_currency || 'INR',\n        proHostingTools: !!updatedUser.pro_hosting_tools,\n        customProfileUrl: updatedUser.custom_profile_url || ''`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated backend userAuth.js for proHostingTools and customProfileUrl!');
