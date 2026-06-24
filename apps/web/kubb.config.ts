import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginCypress } from '@kubb/plugin-cypress'
import { pluginFaker } from '@kubb/plugin-faker'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  root: '.',
  input: {
    path: '../cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json',
  },
  output: {
    path: './src/generated',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'models' },
    }),
    pluginClient({
      output: { path: 'clients' },
    }),
    pluginReactQuery({
      output: { path: 'hooks' },
    }),
    pluginZod({
      output: { path: 'zod' },
    }),
    pluginFaker({
      output: { path: 'mocks' },
    }),
    pluginCypress(),
  ],
})
