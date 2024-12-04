import {
  Page,
  LegacyCard,
  DataTable,
  Grid,
  BlockStack,
  Button,
  Card,
  InlineGrid,
  Text,
  List,
  MediaCard,
  Bleed,
  Layout,
} from "@shopify/polaris";
import { Redirect } from "@shopify/app-bridge/actions";
import { useState, useCallback } from "react";
import { useLoaderData } from "@remix-run/react";
import { PlusIcon } from "@shopify/polaris-icons";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { redirect, useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const allData = await prisma.wishlist.findMany();

  const serializedData = allData.map((item) => {
    return JSON.parse(
      JSON.stringify(item, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  });

  console.log("Serialized Data", serializedData);

  return json(
    { serializedData },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `https://${session.shop}`,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-shopify-access-token",
        "x-shopify-access-token": session.accessToken,
      },
    },
  );
};

export default function Index() {
  const { serializedData } = useLoaderData();
  console.log("Serialized Data", serializedData);
  const shopify = useAppBridge();
  console.log("shopify", shopify);

  const groupedData = groupDataByShopId(serializedData);

  const rows = groupedData.map((item) => [
    item.shopId,
    item.totalProducts,
    item.firstCreated,
  ]);

  const [sortedRows, setSortedRows] = useState(rows);

  const handleSort = useCallback(
    (index, direction) => {
      setSortedRows(sortCurrency(sortedRows, index, direction));
    },
    [sortedRows],
  );

  const handleRedirect = () => {
    console.log("click")
    const redirect = Redirect.create(shopify);
    redirect.dispatch(
      Redirect.Action.ADMIN_PATH,
      "/themes/current/editor" 
    );
  };

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <BlockStack gap="200">
            <MediaCard
              title="Getting Started"
              primaryAction={{
                content: "Configure Wishify",
                onAction: () => {},
              }}
              description="Configure your app with Wishify."
              popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
            >
              <img
                alt=""
                width="50%"
                height="80%"
                style={{
                  margin: " 20px 60px 30px",
                }}
                src="data:image/png;base64,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"
              />
            </MediaCard>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
            <LegacyCard>
              <Grid.Cell>
                <DataTable
                  columnContentTypes={["text", "numeric", "text"]}
                  headings={["Shop ", "Total Products", " Created"]}
                  rows={sortedRows}
                  sortable={[true, true, true]}
                  defaultSortDirection="ascending"
                  initialSortColumnIndex={1}
                  onSort={handleSort}
                />
              </Grid.Cell>
            </LegacyCard>

            <Card roundedAbove="sm">
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <Text as="h2" variant="headingSm">
                    Configurations
                  </Text>
                  <Button
                    icon={PlusIcon}
                    variant="primary"
                    tone="critical"
                    onClick={handleRedirect}
                  >
                    Configure Wishify
                  </Button>
                </InlineGrid>
                <Text as="p" variant="bodyMd">
                  Add Product To Wishlist
                </Text>
                <List type="bullet">
                  <List.Item>Add Wishlist-Show App Block To Header</List.Item>
                  <List.Item>
                    Add Wishlist-Button App Block After Buy Button in Product
                    Page
                  </List.Item>
                  <List.Item>View Store And Enjoy</List.Item>
                </List>
              </BlockStack>
            </Card>
          </Grid>
        </Layout.Section>

        <Layout.Section>
          <InlineGrid gap="400" columns={3}>
            <Card padding={"1200"}>
              <Text as="h2" variant="headingXl" alignment="center">
                Total Product
              </Text>
              <Text as="h2" variant="headingXl" alignment="center">
                {groupedData?.length}
              </Text>
            </Card>
            <Card padding={"1200"}>
              <Text as="h2" variant="headingXl" alignment="center">
                Total Store
              </Text>
              <Text as="h2" variant="headingXl" alignment="center">
                {groupedData?.length}
              </Text>
            </Card>
            <Card background="bg-fill-caution" padding={"1200"}>
              <Text as="h1" variant="headingXl" alignment="center">
                Total Traffic
              </Text>
              <Text
                as="h1"
                variant="headingLg"
                tone={"critical"}
                alignment="center"
              >
                1000
              </Text>
            </Card>
          </InlineGrid>
        </Layout.Section>

        <Layout.Section></Layout.Section>
      </Layout>
    </Page>
  );
}

function groupDataByShopId(data) {
  const grouped = {};

  data.forEach((item) => {
    const shopId = item.shop;

    if (!grouped[shopId]) {
      const date = item.createdAt.split("T")[0];
      grouped[shopId] = {
        shopId: shopId,
        totalProducts: 0,
        firstCreated: date,
      };
    }

    grouped[shopId].totalProducts += 1;

    if (new Date(item.createdAt) < new Date(grouped[shopId].firstCreated)) {
      const date = item.createdAt.split("T")[0];
      grouped[shopId].firstCreated = date;
    }
  });

  return Object.values(grouped);
}

function sortCurrency(rows, index, direction) {
  return [...rows].sort((rowA, rowB) => {
    const valueA = rowA[index];
    const valueB = rowB[index];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "descending"
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "descending" ? valueB - valueA : valueA - valueB;
    }

    return 0;
  });
}
