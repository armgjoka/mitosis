import { componentToBuilder } from '@/generators/builder';
import { componentToHtml } from '@/generators/html';
import { componentToMitosis } from '@/generators/mitosis';
import { ToMitosisOptions } from '@/generators/mitosis/types';
import { componentToReact } from '@/generators/react';
import { componentToVue } from '@/generators/vue';
import { dedent } from '@/helpers/dedent';
import {
  builderContentToMitosisComponent,
  builderElementToMitosisNode,
  extractStateHook,
} from '@/parsers/builder';
import { parseJsx } from '@/parsers/jsx';
import { compileAwayBuilderComponents } from '@/plugins/compile-away-builder-components';
import { BuilderContent } from '@builder.io/sdk';

import columns from './data/blocks/columns.raw.tsx?raw';
import customCode from './data/blocks/custom-code.raw.tsx?raw';
import embed from './data/blocks/embed.raw.tsx?raw';
import image from './data/blocks/image.raw.tsx?raw';
import indexInFor from './data/blocks/index-in-for.raw.tsx?raw';
import stamped from './data/blocks/stamped-io.raw.tsx?raw';
import booleanContent from './data/builder/boolean.json?raw';
import customComponentSlotPropertyContent from './data/builder/custom-component-slot-property.json?raw';
import lazyLoadSection from './data/builder/lazy-load-section.json?raw';
import localization from './data/builder/localization.json?raw';
import slotsContent from './data/builder/slots.json?raw';
import slots2Content from './data/builder/slots2.json?raw';
import textBindings from './data/builder/text-bindings.json?raw';
import advancedFor from './data/for/advanced-for.raw.tsx?raw';
import asyncBindings from './data/ref/basic-ref-assignment.raw.tsx?raw';
import show from './data/show/show-expressions.raw.tsx?raw';

const mitosisOptions: ToMitosisOptions = {
  format: 'legacy',
};

describe('Builder', () => {
  test('extractStateHook', () => {
    const code = `useState({ foo: 'bar' }); alert('hi');`;
    expect(extractStateHook(code)).matchSnapshot();
  });

  test('Stamped', () => {
    const component = parseJsx(stamped);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Show', () => {
    const component = parseJsx(show);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Advanced For', () => {
    const component = parseJsx(advancedFor);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('CustomCode', () => {
    const component = parseJsx(customCode);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('async bindings', () => {
    const component = parseJsx(asyncBindings);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Embed', () => {
    const component = parseJsx(embed);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Index inside For', () => {
    const component = parseJsx(indexInFor);
    const builderJson = componentToBuilder()({ component });
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Image', () => {
    const component = parseJsx(image);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Columns', () => {
    const component = parseJsx(columns);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis()({ component: backToMitosis });
    expect(mitosis).toMatchSnapshot();
  });

  test('Section', async () => {
    const component = builderContentToMitosisComponent(JSON.parse(lazyLoadSection));

    const html = await componentToHtml({
      plugins: [compileAwayBuilderComponents()],
    })({ component });

    expect(html).toMatchSnapshot();
  });

  test('Text with bindings', async () => {
    const originalBuilder = JSON.parse(textBindings);
    const component = builderContentToMitosisComponent(originalBuilder);
    const mitosisJsx = componentToMitosis()({ component });

    expect(component).toMatchSnapshot();
    expect(mitosisJsx).toMatchSnapshot();

    const backToBuilder = componentToBuilder()({ component });
    expect(backToBuilder).toMatchSnapshot();
  });

  test('Regenerate Image', () => {
    const code = dedent`
      import { useStore } from "@builder.io/mitosis";
      import { Image } from "@components";

      export default function MyComponent(props) {
        const state = useStore({ people: ["Steve", "Sewell"] });

        return (
          <div
            css={{
              padding: "20px",
            }}
          >
            <Image
              image="https://cdn.builder.io/api/v1/image/foobar"
              sizes="100vw"
              backgroundSize="contain"
              css={{
                marignTop: "50px",
                display: "block",
              }}
            />
          </div>
        );
      }
    `;

    const component = parseJsx(code);
    const builderJson = componentToBuilder()({ component });
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    expect(backToMitosis.state).toEqual(component.state);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
    const react = componentToReact({
      plugins: [compileAwayBuilderComponents()],
    })({ component });
    expect(react).toMatchSnapshot();
  });

  test('Regenerate Text', () => {
    const code = dedent`
      import { useStore } from "@builder.io/mitosis";

      export default function MyComponent(props) {
        const state = useStore({ people: ["Steve", "Sewell"] });

        return (
          <div
            css={{
              padding: "20px",
            }}
          >
            <h2
              css={{
                marginBottom: "20px",
              }}
            >
              Hello!
            </h2>
          </div>
        );
      }
    `;

    const component = parseJsx(code);
    const builderJson = componentToBuilder()({ component });
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
  });

  test('Regenerate loop', () => {
    const code = dedent`
      import { useStore, For } from "@builder.io/mitosis";

      export default function MyComponent(props) {
        const state = useStore({ people: ["Steve", "Sewell"] });

        onMount(() => {
          state.people.push("John");
        });

        return (
          <For each={state.people}>
            {(person, index) => (
              <div
                key={person}
                css={{
                  padding: "10px 0",
                }}
              >
                <span>{person}</span>
                <span>{index}</span>
              </div>
            )}
          </For>
        );
      }
    `;

    const component = parseJsx(code);
    const builderJson = componentToBuilder()({ component });
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
  });

  test('Regenerate loop with Text node when using CSS', () => {
    const builderJson: BuilderContent = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element',
            '@version': 2,
            repeat: {
              collection: 'state.submenusItem.menuItems',
            },
            id: 'builder-ID',
            class: 'class-id',
            component: {
              name: 'Text',
              options: {
                text: 'text-content',
              },
            },
            responsiveStyles: {
              large: {
                padding: '2px',
              },
            },
          },
        ],
      },
    } as BuilderContent;
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toMatchSnapshot();
  });

  test('No srcset for SVG', async () => {
    const builderJson: BuilderContent = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element',
            component: {
              name: 'Image',
              options: {
                image: 'https://cdn.builder.io/api/v1/image/dummy.svg',
                noWebp: true,
              },
            },
          },
        ],
      },
    } as BuilderContent;
    const component = builderContentToMitosisComponent(builderJson);
    const html = await componentToHtml({
      plugins: [compileAwayBuilderComponents()],
    })({ component });
    expect(html).toMatchSnapshot();
  });

  test('Valid Custom Code', async () => {
    const builderJson: BuilderContent = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element',
            component: {
              name: 'CustomCode',
              options: {
                code: `<svg width="200" height="200"></svg>`,
              },
            },
          },
        ],
      },
    } as BuilderContent;
    const component = builderContentToMitosisComponent(builderJson);

    const vue = componentToVue({
      plugins: [compileAwayBuilderComponents()],
    })({ component });
    expect(vue).toMatchSnapshot();

    const react = componentToReact({
      plugins: [compileAwayBuilderComponents()],
    })({ component });
    expect(react).toMatchSnapshot();
  });

  test('Regenerate custom Hero', () => {
    const code = dedent`
      import { Hero } from "@components";

      export default function MyComponent(props) {
        return (
          <Hero
            title="Your Title Here"
            image="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F52dcecf48f9c48cc8ddd8f81fec63236"
            buttonLink="https://example.com"
            buttonText="Click"
            multiBinding={{
              hello: state.message,
            }}
            height={400}
            css={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              position: "relative",
              flexShrink: "0",
              boxSizing: "border-box",
              marginTop: "200px",
            }}
          />
        );
      }
    `;

    const component = parseJsx(code);
    expect(component).toMatchSnapshot();
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    expect(backToMitosis).toMatchSnapshot();
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
  });

  // TODO: fix divs and CoreFragment - need to find way to reproduce
  test.skip('Regenerate fragments', () => {
    const code = dedent`
      export default function MyComponent(props) {
        return (
          <>
            Hello world

            <>
              <Fragment>Hi</Fragment>
            </>
          </>
        );
      }
    `;

    const component = parseJsx(code);
    expect(component).toMatchSnapshot();
    const builderJson = componentToBuilder()({ component });
    expect(builderJson).toMatchSnapshot();
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    expect(backToMitosis).toMatchSnapshot();
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
  });

  // TODO: get passing, don't add extra divs. or at least use spans instead so don't break layout
  test.skip('Regenerate span text', () => {
    const code = dedent`
      export default function MyComponent(props) {
        return (
          <div
            css={{
              display: "block",
            }}
          >
            Hi there
            <span
              css={{
                color: "red",
              }}
            >
              Hello world
            </span>
          </div>
        );
      }
    `;

    const component = parseJsx(code);
    const builderJson = componentToBuilder()({ component });
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
  });

  test('slots', async () => {
    const component = builderContentToMitosisComponent(JSON.parse(slotsContent));

    const out = await componentToReact({
      plugins: [compileAwayBuilderComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('slots2', async () => {
    const component = builderContentToMitosisComponent(JSON.parse(slots2Content));

    const out = await componentToReact({
      plugins: [compileAwayBuilderComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('customComponentSlotProperty', async () => {
    const component = builderContentToMitosisComponent(
      JSON.parse(customComponentSlotPropertyContent),
    );

    const out = await componentToReact({
      plugins: [compileAwayBuilderComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('booleans', async () => {
    const component = builderContentToMitosisComponent(JSON.parse(booleanContent));

    const out = await componentToReact({
      plugins: [compileAwayBuilderComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('bindings', () => {
    const component = builderContentToMitosisComponent(bindingJson as any as BuilderContent);
    expect(component).toMatchSnapshot();
    const mitosis = componentToMitosis(mitosisOptions)({
      component,
    });
    expect(mitosis).toMatchSnapshot();
  });

  test('localization', () => {
    const originalBuilder = JSON.parse(localization);
    const component = builderContentToMitosisComponent(originalBuilder);
    const mitosisJsx = componentToMitosis()({ component });
    expect(component).toMatchSnapshot();
    expect(mitosisJsx).toMatchSnapshot();

    const backToBuilder = componentToBuilder()({ component });
    expect(backToBuilder).toMatchSnapshot();
  });

  test('null values', () => {
    const component = builderElementToMitosisNode(
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'builder-170e19cac58e4c28998d443a9dce80b8',
        linkUrl: null,
        component: {
          name: 'CustomText',
          options: {
            text: 'hello',
            text2: null,
          },
        },
        properties: {
          href: null,
        },
      } as any,
      {},
    );

    expect(component).toMatchSnapshot();
  });

  test('preserve cssCode when converting', () => {
    const builderJson: BuilderContent = {
      data: {
        cssCode: dedent`
        .foo {
          background: green;
        }

        .bar {
          font-weight: bold;
        }
      `,
        blocks: [],
      },
    };
    const builderToMitosis = builderContentToMitosisComponent(builderJson);
    expect(builderToMitosis.meta.cssCode).toMatchSnapshot();

    const mitosisToBuilder = componentToBuilder()({ component: builderToMitosis })!;
    expect(mitosisToBuilder.data!.cssCode).toMatchSnapshot();

    const jsx = componentToMitosis(mitosisOptions)({
      component: builderToMitosis,
    });
    expect(jsx).toMatchSnapshot();

    const jsxToMitosis = parseJsx(jsx);
    expect(jsxToMitosis.style).toMatchSnapshot();
  });

  test('Snapshot PersonalizedContainer', () => {
    const code = dedent`
      import { PersonalizationContainer, Variant } from "@components";

      export default function MyComponent(props) {
        return (
          <PersonalizationContainer>
            <Variant
              name="variant1"
              startDate="2024-01-01"
              query={{
                property: "urlPath",
                operation: "is",
                value: "/home",
              }}
            >
              <div>Home</div>
              <div>Div</div>
            </Variant>
            <PersonalizationOption
              name="2"
              query={[
                {
                  property: "gendr",
                  operation: "is",
                  value: ["male", "female"],
                },
              ]}
            >
              <>Male</>
            </PersonalizationOption>
            <Variant>
              <div>Default</div>
            </Variant>
            <div>More tree</div>

          </PersonalizationContainer>
        );
      }
    `;

    const component = parseJsx(code);
    const builderJson = componentToBuilder()({ component });
    expect(builderJson.data?.blocks?.[0]).toMatchSnapshot();

    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toMatchSnapshot();
  });

  test('Regenerate PersonalizedContainer', () => {
    const code = dedent`
      import { PersonalizationContainer, Variant } from "@components";

      export default function MyComponent(props) {
        return (
          <PersonalizationContainer>
            <Variant
              name="2"
              startDate="2024-01-01"
              endDate="2024-01-31"
              query={[
                {
                  property: "gendr",
                  operation: "is",
                  value: "male",
                },
              ]}
            >
              <div>Male</div>
            </Variant>
            <Variant default="">
              <div>Default</div>
            </Variant>
          </PersonalizationContainer>
        );
      }
    `;

    const component = parseJsx(code);
    const builderJson = componentToBuilder()({ component });
    const backToMitosis = builderContentToMitosisComponent(builderJson);
    const mitosis = componentToMitosis(mitosisOptions)({
      component: backToMitosis,
    });
    expect(mitosis.trim()).toEqual(code.trim());
  });

  test('do not generate empty expression for width on Column', () => {
    const content = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'Columns',
              options: {
                columns: [{ blocks: [] }, { blocks: [], width: 50 }],
              },
            },
          },
        ],
      },
    };

    const mitosisJson = builderContentToMitosisComponent(content);

    const mitosis = componentToMitosis(mitosisOptions)({
      component: mitosisJson,
    });

    expect(mitosis).toMatchInlineSnapshot(`
      "import { Columns, Column } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <Columns>
            <Column />
            <Column width={50} />
          </Columns>
        );
      }
      "
    `);
  });

  test('map Column widths', () => {
    const content = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'Columns',
              options: {
                columns: [{ blocks: [], width: 50 }, { blocks: [] }],
              },
            },
          },
        ],
      },
    };

    const mitosisJson = builderContentToMitosisComponent(content);

    const backToBuilder = componentToBuilder()({ component: mitosisJson });
    expect(backToBuilder).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "Columns",
                "options": {
                  "columns": [
                    {
                      "blocks": [],
                      "width": 50,
                    },
                    {
                      "blocks": [],
                    },
                  ],
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });

  test('nodes as props', () => {
    const content = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'Foo',
              options: {
                prop: [
                  {
                    '@type': '@builder.io/sdk:Element' as const,
                    component: {
                      name: 'Bar',
                      options: {
                        hello: 'world',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const mitosisJson = builderContentToMitosisComponent(content);
    expect(mitosisJson).toMatchSnapshot();
    const mitosis = componentToMitosis(mitosisOptions)({
      component: mitosisJson,
    });

    expect(mitosis).toMatchSnapshot();

    const builder = parseJsx(mitosis);
    expect(builder).toMatchSnapshot();
    const json = componentToBuilder()({ component: builder });
    expect(json).toMatchSnapshot();
    expect(json.data?.blocks?.[0]?.component?.name).toBe('Foo');
    expect(json.data?.blocks?.[0]?.component?.options?.prop?.[0]?.component?.options.hello).toBe(
      'world',
    );
  });

  test('preserve bound media query styles when converting to mitosis', () => {
    const content = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            bindings: {
              'responsiveStyles.small.left': 'state.left',
              'responsiveStyles.small.top': 'state.top',
              'responsiveStyles.large.color': 'state.color',
              'style.fontSize': 'state.fontSize',
              'style.background': '"red"',
              'responsiveStyles.large.background': '"green"',
            },
          },
        ],
      },
    };

    const mitosis = builderContentToMitosisComponent(content);
    expect(mitosis.children[0].bindings).toMatchInlineSnapshot(`
      {
        "style": {
          "bindingType": "expression",
          "code": "{ fontSize: state.fontSize, background: \\"red\\", \\"@media (max-width: 640px)\\": { left: state.left, top: state.top }, \\"@media (max-width: 1200px)\\": { color: state.color, background: \\"green\\" }, }",
          "type": "single",
        },
      }
    `);

    const jsx = componentToMitosis()({ component: mitosis });
    expect(jsx).toMatchInlineSnapshot(`
          "export default function MyComponent(props) {
            return (
              <div
                style={{
                  fontSize: state.fontSize,
                  background: \\"red\\",
                  \\"@media (max-width: 640px)\\": {
                    left: state.left,
                    top: state.top,
                  },
                  \\"@media (max-width: 1200px)\\": {
                    color: state.color,
                    background: \\"green\\",
                  },
                }}
              />
            );
          }
          "
        `);

    const json = componentToBuilder()({ component: mitosis });
    expect(json).toMatchInlineSnapshot(`
          {
            "data": {
              "blocks": [
                {
                  "@type": "@builder.io/sdk:Element",
                  "actions": {},
                  "bindings": {
                    "responsiveStyles.large.background": "\\"green\\"",
                    "responsiveStyles.large.color": "state.color",
                    "responsiveStyles.small.left": "state.left",
                    "responsiveStyles.small.top": "state.top",
                    "style.background": "\\"red\\"",
                    "style.fontSize": "state.fontSize",
                  },
                  "children": [],
                  "code": {
                    "actions": {},
                    "bindings": {},
                  },
                  "properties": {},
                  "tagName": "div",
                },
              ],
              "jsCode": "",
              "tsCode": "",
            },
          }
        `);
  });

  test('drop unsupported bound styles to avoid crashes', () => {
    const jsx = `export default function MyComponent(props) {
      return (
        <div
          style={{
            fontSize: state.fontSize,
            '&:hover': {
              backgroundColor: state.foo === 1 ? "red" : "blue"
            }
          }}
        />
      );
    }`;

    const mitosis = parseJsx(jsx);

    const json = componentToBuilder()({ component: mitosis });
    expect(json).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {
                "style.fontSize": "state.fontSize",
              },
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "properties": {},
              "tagName": "div",
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });

  test('map custom component bindings', () => {
    const content = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            '@version': 2,
            component: {
              name: 'Header',
              options: {
                variant: 'h1',
                description: 'Collection description',
                actions: [
                  {
                    '@type': '@builder.io/sdk:Element',
                    '@version': 2,
                    component: {
                      name: 'Button',
                    },
                  },
                  {
                    '@type': '@builder.io/sdk:Element',
                    '@version': 2,
                    component: {
                      name: 'Button',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const mitosis = builderContentToMitosisComponent(content);
    expect(mitosis.children).toMatchInlineSnapshot(`
      [
        {
          "@type": "@builder.io/mitosis/node",
          "bindings": {},
          "children": [],
          "meta": {},
          "name": "Header",
          "properties": {
            "$tagName": undefined,
            "description": "Collection description",
            "variant": "h1",
          },
          "scope": {},
          "slots": {
            "actions": [
              {
                "@type": "@builder.io/mitosis/node",
                "bindings": {},
                "children": [],
                "meta": {},
                "name": "Button",
                "properties": {},
                "scope": {},
                "slots": {},
              },
              {
                "@type": "@builder.io/mitosis/node",
                "bindings": {},
                "children": [],
                "meta": {},
                "name": "Button",
                "properties": {},
                "scope": {},
                "slots": {},
              },
            ],
          },
        },
      ]
    `);

    const jsx = componentToMitosis()({ component: mitosis });
    expect(jsx).toMatchInlineSnapshot(`
      "import { Header, Button } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <Header
            variant=\\"h1\\"
            description=\\"Collection description\\"
            actions={
              <>
                <Button />
                <Button />
              </>
            }
          />
        );
      }
      "
    `);

    const backToMitosis = parseJsx(jsx);
    expect(backToMitosis.children).toMatchInlineSnapshot(`
      [
        {
          "@type": "@builder.io/mitosis/node",
          "bindings": {
            "actions": {
              "bindingType": "expression",
              "code": "<>
                <Button />
                <Button />
              </>",
              "type": "single",
            },
          },
          "children": [],
          "meta": {},
          "name": "Header",
          "properties": {
            "description": "Collection description",
            "variant": "h1",
          },
          "scope": {},
          "slots": {
            "actions": [
              {
                "@type": "@builder.io/mitosis/node",
                "bindings": {},
                "children": [
                  {
                    "@type": "@builder.io/mitosis/node",
                    "bindings": {},
                    "children": [],
                    "meta": {},
                    "name": "Button",
                    "properties": {},
                    "scope": {},
                  },
                  {
                    "@type": "@builder.io/mitosis/node",
                    "bindings": {},
                    "children": [],
                    "meta": {},
                    "name": "Button",
                    "properties": {},
                    "scope": {},
                  },
                ],
                "meta": {},
                "name": "Fragment",
                "properties": {},
                "scope": {},
              },
            ],
          },
        },
      ]
    `);

    const json = componentToBuilder()({ component: backToMitosis });
    expect(json).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "Header",
                "options": {
                  "actions": [
                    {
                      "@type": "@builder.io/sdk:Element",
                      "actions": {},
                      "bindings": {},
                      "children": [
                        {
                          "@type": "@builder.io/sdk:Element",
                          "actions": {},
                          "bindings": {},
                          "children": [],
                          "code": {
                            "actions": {},
                            "bindings": {},
                          },
                          "component": {
                            "name": "Button",
                            "options": {},
                          },
                        },
                        {
                          "@type": "@builder.io/sdk:Element",
                          "actions": {},
                          "bindings": {},
                          "children": [],
                          "code": {
                            "actions": {},
                            "bindings": {},
                          },
                          "component": {
                            "name": "Button",
                            "options": {},
                          },
                        },
                      ],
                      "code": {
                        "actions": {},
                        "bindings": {},
                      },
                      "component": {
                        "name": "Fragment",
                        "options": {},
                      },
                    },
                  ],
                  "description": "Collection description",
                  "variant": "h1",
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });
});

const bindingJson = {
  data: {
    inputs: [
      {
        '@type': '@builder.io/core:Field',
        meta: {},
        name: 'text',
        type: 'text',
        defaultValue: 'Hello',
        required: false,
        subFields: [],
        helperText: '',
        autoFocus: false,
        simpleTextOnly: false,
        disallowRemove: false,
        broadcast: false,
        bubble: false,
        hideFromUI: false,
        hideFromFieldsEditor: false,
        showTemplatePicker: true,
        permissionsRequiredToEdit: '',
        advanced: false,
        copyOnAdd: true,
        onChange: '',
        showIf: '',
        mandatory: false,
        hidden: false,
        noPhotoPicker: false,
        model: '',
        supportsAiGeneration: false,
        defaultCollapsed: false,
      },
    ],
    cssCode: 'builder-component { max-width: none !important; }',
    blocks: [
      {
        component: {
          name: 'Button',
          options: {
            label: 'hello',
          },
        },
        code: {
          bindings: {
            'component.options.label': 'state.text',
          },
        },
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'builder-1e4cca42847b4712ae978bc679bf1d4a',
        meta: {
          id: '103:1952',
          type: 'COMPONENT',
          name: 'Frame 94',
          componentProperties: null,
          fromFigma: true,
          vcpImportId: 'vcp-635bba9daed9496f82e2b1009dff92a2',
        },
        children: [
          {
            '@type': '@builder.io/sdk:Element',
            '@version': 2,
            bindings: {
              'component.options.text': 'var _virtual_index=state.text;return _virtual_index',
            },
            code: { bindings: { 'component.options.text': 'state.text' } },
            layerName: 'Book an Appointment',
            id: 'builder-559bbc2a33124e8e843ddec300dcb5a9',
            meta: {
              id: '103:1951',
              type: 'TEXT',
              name: 'Book an Appointment',
              componentPropertyReferences: { characters: 'Text#103:0' },
            },
            component: { name: 'Text', options: { text: 'BUY NOW' } },
          },
        ],
        responsiveStyles: {
          large: {
            backgroundColor: 'rgba(0, 0, 0, 1)',
            display: 'flex',
            paddingLeft: '72px',
            paddingRight: '72px',
            paddingTop: '25px',
            paddingBottom: '25px',
            alignItems: 'start',
            gap: '10px',
            fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 1)',
            fontWeight: '700',
            textTransform: 'uppercase',
            justifyContent: 'start',
          },
        },
      },
    ],
  },
};
