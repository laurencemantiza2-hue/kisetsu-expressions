import { useEffect, useState } from 'react'

import PaintingEditor from './PaintingEditor.jsx'

import {
  ITEM_TYPES,
  fetchPaintings,
} from '../lib/paintings.js'

const CATALOGS = [
  {
    type: ITEM_TYPES.PAINTING,
    title: 'Paintings',
    description: 'Manage the main paintings displayed on the website.',
    addLabel: 'Add Painting',
  },
  {
    type: ITEM_TYPES.STUDENT_PAINTING,
    title: 'Student Paintings',
    description: 'Manage artwork created by students.',
    addLabel: 'Add Student Painting',
  },
  {
    type: ITEM_TYPES.TSHIRT,
    title: 'T-Shirts',
    description: 'Manage additional T-shirts in the website catalog.',
    addLabel: 'Add T-Shirt',
  },
]

function CatalogSection({
  catalog,
  items,
  loading,
  onAdd,
  onEdit,
}) {
  return (
    <section className="cms-catalog-section">
      <div className="cms-catalog-section-header">
        <div>
          <h2>{catalog.title}</h2>
          <p>{catalog.description}</p>
        </div>

        <button
          type="button"
          className="cms-catalog-add"
          onClick={onAdd}
        >
          + {catalog.addLabel}
        </button>
      </div>

      {loading ? (
        <div className="cms-catalog-empty">
          Loading {catalog.title.toLowerCase()}...
        </div>
      ) : items.length === 0 ? (
        <div className="cms-catalog-empty">
          <strong>No items yet.</strong>
          <span>
            Use "{catalog.addLabel}" to add the first item.
          </span>
        </div>
      ) : (
        <div className="cms-catalog-list">
          {items.map((item) => (
            <article
              key={item.id}
              className="cms-catalog-item"
            >
              <div className="cms-catalog-image">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title || 'Catalog item'}
                  />
                ) : (
                  <div className="cms-catalog-image-placeholder">
                    No image
                  </div>
                )}
              </div>

              <div className="cms-catalog-item-info">
                <h3>{item.title || 'Untitled item'}</h3>

                {item.description && (
                  <p>{item.description}</p>
                )}

                <div className="cms-catalog-meta">
                  {item.price_text && (
                    <span>{item.price_text}</span>
                  )}

                  {item.category && (
                    <span>{item.category}</span>
                  )}

                  {item.status && (
                    <span className="cms-catalog-status">
                      {formatStatus(item.status)}
                    </span>
                  )}
                </div>
              </div>

              <div className="cms-catalog-item-actions">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function formatStatus(status) {
  if (!status) return ''

  return status
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function CatalogManager() {
  const [catalogItems, setCatalogItems] = useState({
    [ITEM_TYPES.PAINTING]: [],
    [ITEM_TYPES.STUDENT_PAINTING]: [],
    [ITEM_TYPES.TSHIRT]: [],
  })

  const [loading, setLoading] = useState({
    [ITEM_TYPES.PAINTING]: true,
    [ITEM_TYPES.STUDENT_PAINTING]: true,
    [ITEM_TYPES.TSHIRT]: true,
  })

  const [editingItem, setEditingItem] = useState(null)

  const loadCatalog = async (itemType) => {
    setLoading((current) => ({
      ...current,
      [itemType]: true,
    }))

    try {
      const items = await fetchPaintings(itemType)

      setCatalogItems((current) => ({
        ...current,
        [itemType]: items,
      }))
    } catch (error) {
      console.error(
        `Failed to load ${itemType} catalog:`,
        error,
      )
    } finally {
      setLoading((current) => ({
        ...current,
        [itemType]: false,
      }))
    }
  }

  const loadAllCatalogs = async () => {
    await Promise.all(
      CATALOGS.map((catalog) =>
        loadCatalog(catalog.type),
      ),
    )
  }

  useEffect(() => {
    loadAllCatalogs()
  }, [])

  const handleAdd = (itemType) => {
    setEditingItem({
      itemType,
      painting: null,
    })
  }

  const handleEdit = (itemType, item) => {
    setEditingItem({
      itemType,
      painting: item,
    })
  }

  const handleSaved = async () => {
    if (!editingItem) return

    const itemType = editingItem.itemType

    setEditingItem(null)

    await loadCatalog(itemType)
  }

  const handleDeleted = async () => {
    if (!editingItem) return

    const itemType = editingItem.itemType

    setEditingItem(null)

    await loadCatalog(itemType)
  }

  return (
    <>
      <div className="cms-catalog-manager">
        <div className="cms-catalog-manager-header">
          <div>
            <p className="cms-catalog-kicker">
              CONTENT MANAGEMENT
            </p>

            <h1>Catalog Management</h1>

            <p>
              Add, edit, replace, or remove items from your
              paintings, student paintings, and T-shirt
              catalogs.
            </p>
          </div>

          <button
            type="button"
            className="cms-catalog-refresh"
            onClick={loadAllCatalogs}
          >
            Refresh
          </button>
        </div>

        {CATALOGS.map((catalog) => (
          <CatalogSection
            key={catalog.type}
            catalog={catalog}
            items={catalogItems[catalog.type] || []}
            loading={loading[catalog.type]}
            onAdd={() => handleAdd(catalog.type)}
            onEdit={(item) =>
              handleEdit(catalog.type, item)
            }
          />
        ))}
      </div>

      {editingItem && (
        <PaintingEditor
          painting={editingItem.painting}
          itemType={editingItem.itemType}
          onClose={() => setEditingItem(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </>
  )
}