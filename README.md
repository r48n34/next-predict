# TFJS CNN in next.js

A quick demo of using TFJS localy predictions for CNN models.  

next-predict.vercel.app  

## Features
1. Load in models in local device run time.  
2. Predict with user devices (No server predictions)  
3. Without tfjs node, only tfjs.   

## Structure
```md
📂 .
├── 📂 components
├── 📂 pages
├── postcss.config.cjs
├─┬ 📂 public
│ ├── favicon.ico
│ └──📂 models (TFJS format models)
├── tsconfig.json
├─┬ 📂 useData
│ └── modelData.ts (Precoded models metadata)
├─┬ 📂 utilis
│ ├── imgDecodeUtilis.ts (tfjs-native source code)
│ ├── pngUtilis.ts (Png utils)
│ └── predictUtili.tsx (For predictions)
└── yarn.lock
```

