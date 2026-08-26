/**
 * Articles hosted directly in this portfolio.
 *
 * These render without any network call, so they always work even if the
 * Hashnode API is unreachable. Slugs listed here take precedence over the
 * Hashnode-fetched post of the same slug.
 *
 * Order here is the order shown in the blog grid (newest first).
 */

import { mariadbCloudsql57Bridge } from './mariadb-cloudsql-57-bridge'
import { awsRedirect } from './aws-redirect'
import { eks131Oidc } from './eks-131-oidc'
import { cloudNativeEks } from './cloud-native-eks'
import { airflowDocker } from './airflow-docker'
import { eksUpgrade128To129 } from './eks-upgrade-1-28-to-1-29'
import type { LocalPost } from './types'

export type { LocalPost }

export const localPosts: LocalPost[] = [
    mariadbCloudsql57Bridge, // 2026-08-26
    awsRedirect, // 2025-07-10
    eks131Oidc, // 2025-06-27
    cloudNativeEks, // 2025-04-24
    airflowDocker, // 2025-01-11
    eksUpgrade128To129, // 2024-10-25
]

export const findLocalPost = (slug?: string) =>
    slug ? localPosts.find((p) => p.slug === slug) : undefined
