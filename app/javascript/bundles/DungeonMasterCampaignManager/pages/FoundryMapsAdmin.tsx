import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PageContainer from '../containers/PageContainer';
import PageTitle from '../components/PageTitle/PageTitle';
import Button from '../components/Button/Button';
import { Colors } from '../utilities/enums';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import {
  ControlledInput,
  ControlledSelect,
  ControlledTagInput,
} from '../components/forms/ControllerInput';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { GiSave } from 'react-icons/gi';
import { GiLinkedRings } from 'react-icons/gi';
import { MdEdit, MdDelete, MdVisibility, MdSave, MdCancel } from 'react-icons/md';
import ImageResize from 'quill-image-resize-module-react';
import { addFlashMessage, FlashMessageType } from '../reducers/flashMessages';
import FlashMessages from '../components/Alerts/FlashMessages';

Quill.register('modules/imageResize', ImageResize);

import styles from './foundry-maps-admin.module.scss';

interface FoundryMapFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  signed_url?: string;
}

interface FoundryMap {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  access: string;
  requiredTier?: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  files?: FoundryMapFile[];
}

interface MapTag {
  id: string;
  name: string;
  slug: string;
  mapCount: number;
}

const FoundryMapsAdmin: React.FC = () => {
  const dispatch = useDispatch();
  const [maps, setMaps] = useState<FoundryMap[]>([]);
  const [tags, setTags] = useState<MapTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [editingMap, setEditingMap] = useState<FoundryMap | null>(null);
  const [viewingMap, setViewingMap] = useState<FoundryMap | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState<string>('');
  const [newTagName, setNewTagName] = useState<string>('');
  const [isEditingInModal, setIsEditingInModal] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      access_level: 'free',
      required_tier: 'free',
      published: false,
      tags: '',
    },
  });

  // Handle image upload for React Quill
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/v1/maps/upload_image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            if (range) {
              quill.insertEmbed(range.index, 'image', data.url);
              quill.setSelection({ index: range.index + 1, length: 0 });
            }
          }
        } else {
          dispatch(
            addFlashMessage({
              id: Date.now(),
              heading: 'Upload Failed',
              text: 'Failed to upload image to description',
              messageType: FlashMessageType.danger,
            }),
          );
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Upload Failed',
            text: 'Failed to upload image to description',
            messageType: FlashMessageType.danger,
          }),
        );
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    },
  };

  useEffect(() => {
    fetchMaps();
    fetchTags();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await fetch('/v1/maps', {
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      setMaps(data);
    } catch (error) {
      console.error('Error fetching maps:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/v1/map-tags', {
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchMapDetails = async (mapId: string): Promise<FoundryMap | null> => {
    try {
      const response = await fetch(`/v1/maps/${mapId}`, {
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching map details:', error);
    }
    return null;
  };

  const handleEdit = async (map: FoundryMap) => {
    const detailedMap = await fetchMapDetails(map.id);
    if (detailedMap) {
      setEditingMap(detailedMap);
      reset({
        name: detailedMap.name,
        description: detailedMap.description || '',
        access_level: detailedMap.access === 'Premium' ? 'premium' : 'free',
        required_tier: detailedMap.requiredTier || 'free',
        published: detailedMap.published,
        tags: detailedMap.tags.join(', '),
      });
    } else {
      setEditingMap(map);
      reset({
        name: map.name,
        description: map.description || '',
        access_level: map.access === 'Premium' ? 'premium' : 'free',
        required_tier: map.requiredTier || 'free',
        published: map.published,
        tags: map.tags.join(', '),
      });
    }
    setShowForm(true);
  };

  const handleView = async (map: FoundryMap) => {
    const detailedMap = await fetchMapDetails(map.id);
    setViewingMap(detailedMap || map);
    setIsEditingInModal(false);
  };

  const handleEditInModal = async (map: FoundryMap) => {
    const detailedMap = await fetchMapDetails(map.id);
    const mapToEdit = detailedMap || map;
    setEditingMap(mapToEdit);
    reset({
      name: mapToEdit.name,
      description: mapToEdit.description || '',
      access_level: mapToEdit.access === 'Premium' ? 'premium' : 'free',
      required_tier: mapToEdit.requiredTier || 'free',
      published: mapToEdit.published,
      tags: mapToEdit.tags.join(', '),
    });
    setIsEditingInModal(true);
  };

  const handleCancelEditInModal = () => {
    setIsEditingInModal(false);
    setEditingMap(null);
    setSelectedFiles(null);
    setSelectedThumbnail(null);
  };

  const handleCancelEdit = () => {
    setEditingMap(null);
    setShowForm(false);
    setSelectedFiles(null);
    setSelectedThumbnail(null);
    // Reset form to default values
    reset({
      name: '',
      description: '',
      access_level: 'free',
      published: false,
      tags: '',
    });
  };

  const onSubmit = async (data: FieldValues) => {
    setUploadingFiles(true);
    try {
      const url = editingMap ? `/v1/maps/${editingMap.id}` : '/v1/maps';
      const method = editingMap ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          foundry_map: {
            name: data.name,
            description: data.description,
            access_level: data.access_level,
            required_tier: data.required_tier,
            published: data.published,
          },
          tags: data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        const savedMap = await response.json();

        // If a thumbnail was selected, upload it
        if (selectedThumbnail) {
          const thumbnailFormData = new FormData();
          thumbnailFormData.append('thumbnail', selectedThumbnail);

          const thumbnailResponse = await fetch(`/v1/maps/${savedMap.id}/upload_thumbnail`, {
            method: 'POST',
            body: thumbnailFormData,
          });

          if (!thumbnailResponse.ok) {
            const thumbnailError = await thumbnailResponse.json();
            dispatch(
              addFlashMessage({
                id: Date.now(),
                heading: 'Thumbnail Upload Failed',
                text: thumbnailError.error || 'Failed to upload thumbnail',
                messageType: FlashMessageType.warning,
              }),
            );
          }
        }

        // If a ZIP package was selected, upload it
        if (selectedFiles && selectedFiles.length > 0) {
          const uploadFormData = new FormData();
          uploadFormData.append('package', selectedFiles[0]);

          const uploadResponse = await fetch(`/v1/maps/${savedMap.id}/upload_package`, {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json();
            dispatch(
              addFlashMessage({
                id: Date.now(),
                heading: 'Package Upload Failed',
                text: uploadError.error || 'Failed to upload package',
                messageType: FlashMessageType.warning,
              }),
            );
          }
        }

        // Refresh maps list
        await fetchMaps();

        // Show the view modal with updated data (for both create and edit)
        const detailedMap = await fetchMapDetails(savedMap.id);
        setViewingMap(detailedMap || savedMap);

        handleCancelEdit();
      } else {
        const error = await response.json();
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Save Failed',
            text: error.errors?.join(', ') || `Failed to ${editingMap ? 'update' : 'create'} map`,
            messageType: FlashMessageType.danger,
          }),
        );
      }
    } catch (error) {
      console.error('Error saving map:', error);
      dispatch(
        addFlashMessage({
          id: Date.now(),
          heading: 'Network Error',
          text: 'Unable to save map. Check console for details.',
          messageType: FlashMessageType.danger,
        }),
      );
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this map?')) return;

    try {
      const response = await fetch(`/v1/maps/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        // Close view modal if currently viewing this map
        if (viewingMap?.id === id) {
          setViewingMap(null);
        }
        // Refresh the table
        await fetchMaps();
      }
    } catch (error) {
      console.error('Error deleting map:', error);
    }
  };

  const togglePublished = async (id: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/v1/maps/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          foundry_map: { published: !currentPublished },
        }),
      });

      if (response.ok) {
        fetchMaps();
      }
    } catch (error) {
      console.error('Error updating map:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch('/v1/map-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          foundry_map_tag: { name: newTagName.trim() },
        }),
      });

      if (response.ok) {
        setNewTagName('');
        await fetchTags();
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Tag Created',
            text: 'Tag successfully created',
            messageType: FlashMessageType.success,
          }),
        );
      } else {
        const error = await response.json();
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Create Failed',
            text: error.error || 'Failed to create tag',
            messageType: FlashMessageType.danger,
          }),
        );
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      dispatch(
        addFlashMessage({
          id: Date.now(),
          heading: 'Network Error',
          text: 'Unable to create tag. Check console for details.',
          messageType: FlashMessageType.danger,
        }),
      );
    }
  };

  const handleUpdateTag = async (id: string) => {
    if (!editingTagName.trim()) return;

    try {
      const response = await fetch(`/v1/map-tags/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          foundry_map_tag: { name: editingTagName.trim() },
        }),
      });

      if (response.ok) {
        setEditingTagId(null);
        setEditingTagName('');
        await fetchTags();
        await fetchMaps(); // Refresh maps to show updated tag names
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Tag Updated',
            text: 'Tag successfully updated',
            messageType: FlashMessageType.success,
          }),
        );
      } else {
        const error = await response.json();
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Update Failed',
            text: error.error || 'Failed to update tag',
            messageType: FlashMessageType.danger,
          }),
        );
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      dispatch(
        addFlashMessage({
          id: Date.now(),
          heading: 'Network Error',
          text: 'Unable to update tag. Check console for details.',
          messageType: FlashMessageType.danger,
        }),
      );
    }
  };

  const handleDeleteTag = async (id: string, tagName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the tag "${tagName}"? This will remove it from all maps.`,
      )
    )
      return;

    try {
      const response = await fetch(`/v1/map-tags/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        await fetchTags();
        await fetchMaps(); // Refresh maps to update tag lists
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const startEditingTag = (tag: MapTag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const cancelEditingTag = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleDeleteFile = async (mapId: string, fileId: string, fileName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${fileName}"?\n\nWarning: This may break the scene.json if this file is referenced. Make sure to re-export the scene after deleting files.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/v1/maps/${mapId}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        // Refresh map details
        const updatedMap = await fetchMapDetails(mapId);
        if (updatedMap) {
          setEditingMap(updatedMap);
        }
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'File Deleted',
            text: 'File successfully deleted',
            messageType: FlashMessageType.success,
          }),
        );
      } else {
        dispatch(
          addFlashMessage({
            id: Date.now(),
            heading: 'Delete Failed',
            text: 'Failed to delete file',
            messageType: FlashMessageType.danger,
          }),
        );
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      dispatch(
        addFlashMessage({
          id: Date.now(),
          heading: 'Network Error',
          text: 'Unable to delete file. Check console for details.',
          messageType: FlashMessageType.danger,
        }),
      );
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <PageContainer
        pageTitle={'Foundry Maps Admin'}
        description={'Manage FoundryVTT maps for the Dorman Lakely Cartography module'}
      >
        <FlashMessages />
        <PageTitle title="Foundry Maps Admin" />
        <div className={styles.contentWrapper}>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle={'Foundry Maps Admin'}
      description={'Manage FoundryVTT maps for the Dorman Lakely Cartography module'}
    >
      <FlashMessages />
      <PageTitle title="Foundry Maps Admin" />
      <div className={styles.contentWrapper}>
        {/* Maps Management Section */}
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Manage Maps</h2>
            <Button
              onClick={() => (showForm ? handleCancelEdit() : setShowForm(true))}
              color={showForm ? Colors.secondary : Colors.primary}
              title={showForm ? 'Cancel' : '+ New Map'}
            />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Tags</th>
                  <th>Access</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      No maps yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  maps.map((map) => (
                    <tr key={map.id}>
                      <td className={styles.thumbnailCell}>
                        {map.thumbnail ? (
                          <img
                            src={map.thumbnail}
                            alt={map.name}
                            className={styles.tableThumbnail}
                          />
                        ) : (
                          <div className={styles.thumbnailPlaceholder}>
                            <MdVisibility />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className={styles.mapName}>{map.name}</div>
                        {map.description && (
                          <div className={styles.mapDescription}>
                            {stripHtml(map.description).substring(0, 100)}...
                          </div>
                        )}
                      </td>
                      <td>
                        <div className={styles.tagContainer}>
                          {map.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.accessBadge} ${
                            map.access === 'Premium' ? styles.premium : styles.free
                          }`}
                        >
                          {map.access}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => togglePublished(map.id, map.published)}
                          className={`${styles.statusButton} ${
                            map.published ? styles.published : styles.draft
                          }`}
                        >
                          {map.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className={styles.dateText}>
                        {new Date(map.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleView(map)}
                            className={styles.iconButton}
                            title="View map details"
                          >
                            <MdVisibility />
                          </button>
                          <button
                            onClick={() => handleEdit(map)}
                            className={`${styles.iconButton} ${styles.editIcon}`}
                            title="Edit map"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(map.id)}
                            className={`${styles.iconButton} ${styles.deleteIcon}`}
                            title="Delete map"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className={styles.formContainer}>
            <h2>{editingMap ? 'Edit Map' : 'Create New Map'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <ControlledInput
                fieldName="name"
                errors={errors}
                control={control}
                label="Map Name"
                required
                disabled={uploadingFiles}
              />

              <div className={styles.editorWrapper}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={value}
                      onChange={onChange}
                      modules={modules}
                      className={styles.quillEditor}
                      readOnly={uploadingFiles}
                    />
                  )}
                />
              </div>

              <ControlledTagInput
                fieldName="tags"
                control={control}
                label="Tags"
                placeholder="Add tags (press Enter or comma)"
              />

              <ControlledSelect
                fieldName="access_level"
                control={control}
                label="Access Level"
                options={[
                  { value: 'premium', label: 'Premium' },
                  { value: 'free', label: 'Free' },
                ]}
                disabled={uploadingFiles}
              />

              <ControlledSelect
                fieldName="required_tier"
                control={control}
                label="Required Tier"
                options={[
                  { value: 'free', label: 'Free' },
                  { value: 'Apprentice', label: 'Apprentice' },
                  { value: 'Wizard', label: 'Wizard' },
                ]}
                disabled={uploadingFiles}
              />

              <div className={styles.checkboxWrapper}>
                <Controller
                  control={control}
                  name="published"
                  render={({ field: { onChange, value } }) => (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className={styles.checkbox}
                        disabled={uploadingFiles}
                      />
                      <span>Published</span>
                    </label>
                  )}
                />
              </div>

              <div className={styles.fileUploadWrapper}>
                <label htmlFor="thumbnail" className={styles.label}>
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                  className={styles.fileInput}
                  disabled={uploadingFiles}
                />
                {selectedThumbnail && (
                  <div className={styles.fileCount}>
                    {selectedThumbnail.name} selected ({(selectedThumbnail.size / 1024).toFixed(2)}{' '}
                    KB)
                  </div>
                )}
                {editingMap && editingMap.thumbnail && !selectedThumbnail && (
                  <div className={styles.existingThumbnail}>
                    <img
                      src={editingMap.thumbnail}
                      alt="Current thumbnail"
                      style={{ maxWidth: '200px', marginTop: '10px' }}
                    />
                    <p style={{ fontSize: '12px', color: '#666' }}>Current thumbnail</p>
                  </div>
                )}
              </div>

              <div className={styles.fileUploadWrapper}>
                <label htmlFor="files" className={styles.label}>
                  Upload Scene Package
                </label>
                <p className={styles.fieldSubtitle}>
                  Export your Foundry VTT scene using the right-click context menu and upload the
                  ZIP file here.
                </p>
                <input
                  type="file"
                  id="files"
                  accept=".zip,application/zip"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className={styles.fileInput}
                  disabled={uploadingFiles}
                  required={!editingMap}
                />
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className={styles.fileCount}>
                    {selectedFiles[0].name} selected (
                    {(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              {editingMap && editingMap.files && editingMap.files.length > 0 && (
                <div className={styles.existingFilesSection}>
                  <label className={styles.label}>Existing Files:</label>
                  <div className={styles.filesList}>
                    {editingMap.files.map((file) => (
                      <div key={file.id} className={styles.fileItem}>
                        <span className={styles.fileType}>[{file.file_type}]</span>
                        <span className={styles.fileName}>{file.file_name}</span>
                        <span className={styles.fileSize}>
                          ({(file.file_size / 1024).toFixed(2)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(editingMap.id, file.id, file.file_name)}
                          className={styles.fileDeleteButton}
                          disabled={uploadingFiles}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadingFiles && (
                <div className={styles.spinnerContainer}>
                  <GiLinkedRings size={50} className="spinner" />
                  <span>{editingMap ? 'Updating map...' : 'Creating map...'}</span>
                </div>
              )}

              <div className={styles.formButtons}>
                <Button
                  type="button"
                  color={Colors.secondary}
                  title="Cancel"
                  disabled={uploadingFiles}
                  onClick={handleCancelEdit}
                />
                <Button
                  type="submit"
                  color={Colors.success}
                  title={editingMap ? 'Update Map' : 'Create Map'}
                  disabled={uploadingFiles}
                  icon={<GiSave />}
                />
              </div>
            </form>
          </div>
        )}

        {viewingMap && (
          <div className={styles.modalOverlay} onClick={() => setViewingMap(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{viewingMap.name}</h2>
                <div className={styles.modalActions}>
                  <button
                    onClick={() => handleEditInModal(viewingMap)}
                    className={styles.modalIconButton}
                    title="Edit Map"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${viewingMap.name}"?`)) {
                        handleDelete(viewingMap.id);
                        setViewingMap(null);
                      }
                    }}
                    className={`${styles.modalIconButton} ${styles.deleteIcon}`}
                    title="Delete Map"
                  >
                    <MdDelete />
                  </button>
                  <button onClick={() => setViewingMap(null)} className={styles.modalClose}>
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.modalBody}>
                {isEditingInModal ? (
                  <div className={styles.form}>
                    <form
                      onSubmit={handleSubmit(async (data) => {
                        await onSubmit(data);
                        setIsEditingInModal(false);
                      })}
                    >
                      <ControlledInput
                        fieldName="name"
                        errors={errors}
                        control={control}
                        label="Map Name"
                        required
                        disabled={uploadingFiles}
                      />

                      <div className={styles.editorWrapper}>
                        <label htmlFor="description" className={styles.label}>
                          Description
                        </label>
                        <Controller
                          control={control}
                          name="description"
                          render={({ field: { onChange, value } }) => (
                            <ReactQuill
                              ref={quillRef}
                              theme="snow"
                              value={value}
                              onChange={onChange}
                              modules={modules}
                              className={styles.quillEditor}
                              readOnly={uploadingFiles}
                            />
                          )}
                        />
                      </div>

                      <ControlledTagInput
                        fieldName="tags"
                        control={control}
                        label="Tags"
                        placeholder="Add tags (press Enter or comma)"
                      />

                      <ControlledSelect
                        fieldName="access_level"
                        control={control}
                        label="Access Level"
                        options={[
                          { value: 'premium', label: 'Premium' },
                          { value: 'free', label: 'Free' },
                        ]}
                        disabled={uploadingFiles}
                      />

                      <div className={styles.checkboxWrapper}>
                        <Controller
                          control={control}
                          name="published"
                          render={({ field: { onChange, value } }) => (
                            <label className={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                className={styles.checkbox}
                                disabled={uploadingFiles}
                              />
                              <span>Published</span>
                            </label>
                          )}
                        />
                      </div>

                      <div className={styles.fileUploadWrapper}>
                        <label htmlFor="thumbnail" className={styles.label}>
                          Thumbnail Image
                        </label>
                        <input
                          type="file"
                          id="thumbnail"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                          className={styles.fileInput}
                          disabled={uploadingFiles}
                        />
                        {selectedThumbnail && (
                          <div className={styles.fileCount}>
                            {selectedThumbnail.name} selected (
                            {(selectedThumbnail.size / 1024).toFixed(2)} KB)
                          </div>
                        )}
                        {editingMap && editingMap.thumbnail && !selectedThumbnail && (
                          <div className={styles.existingThumbnail}>
                            <img
                              src={editingMap.thumbnail}
                              alt="Current thumbnail"
                              style={{ maxWidth: '200px', marginTop: '10px' }}
                            />
                            <p style={{ fontSize: '12px', color: '#666' }}>Current thumbnail</p>
                          </div>
                        )}
                      </div>

                      <div className={styles.formButtons}>
                        <Button
                          type="submit"
                          color={Colors.primary}
                          title={uploadingFiles ? 'Saving...' : 'Save Map'}
                          icon={<GiSave />}
                          disabled={uploadingFiles}
                        />
                        <Button
                          type="button"
                          color={Colors.secondary}
                          title="Cancel"
                          onClick={handleCancelEditInModal}
                          disabled={uploadingFiles}
                        />
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className={styles.modalBodyLayout}>
                    {(viewingMap.thumbnail ||
                      viewingMap.files?.some((f) => f.file_type === 'background')) && (
                      <div className={styles.thumbnailColumn}>
                        {viewingMap.thumbnail && (
                          <>
                            <label className={styles.viewLabel}>Thumbnail:</label>
                            <div className={styles.thumbnailWrapper}>
                              <img src={viewingMap.thumbnail} alt={viewingMap.name} />
                            </div>
                          </>
                        )}

                        {(() => {
                          const backgroundFile = viewingMap.files?.find(
                            (f) => f.file_type === 'background',
                          );
                          return (
                            backgroundFile?.signed_url && (
                              <div style={{ marginTop: viewingMap.thumbnail ? '1rem' : 0 }}>
                                <label className={styles.viewLabel}>Map Preview:</label>
                                <div className={styles.thumbnailWrapper}>
                                  <img
                                    src={backgroundFile.signed_url}
                                    alt={`${viewingMap.name} preview`}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          );
                        })()}
                      </div>
                    )}

                    <div className={styles.contentColumn}>
                      <div className={styles.viewSection}>
                        <label className={styles.viewLabel}>Description:</label>
                        <div
                          className={styles.viewContent}
                          dangerouslySetInnerHTML={{
                            __html: viewingMap.description || 'No description provided.',
                          }}
                        />
                      </div>

                      <div className={styles.viewSection}>
                        <label className={styles.viewLabel}>Tags:</label>
                        <div className={styles.tagContainer}>
                          {viewingMap.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.viewRow}>
                        <div className={styles.viewSection}>
                          <label className={styles.viewLabel}>Access Level:</label>
                          <span
                            className={`${styles.accessBadge} ${
                              viewingMap.access === 'Premium' ? styles.premium : styles.free
                            }`}
                          >
                            {viewingMap.access}
                          </span>
                        </div>

                        <div className={styles.viewSection}>
                          <label className={styles.viewLabel}>Status:</label>
                          <span
                            className={`${styles.statusBadge} ${
                              viewingMap.published ? styles.published : styles.draft
                            }`}
                          >
                            {viewingMap.published ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <div className={styles.viewSection}>
                          <label className={styles.viewLabel}>Created:</label>
                          <span className={styles.viewText}>
                            {new Date(viewingMap.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {viewingMap.files && viewingMap.files.length > 0 && (
                        <div className={styles.viewSection}>
                          <label className={styles.viewLabel}>
                            Uploaded Files ({viewingMap.files.length}):
                          </label>
                          <div className={styles.filesList}>
                            {viewingMap.files.map((file) => (
                              <div key={file.id} className={styles.fileItem}>
                                <span className={styles.fileType}>[{file.file_type}]</span>
                                <span className={styles.fileName}>{file.file_name}</span>
                                <span className={styles.fileSize}>
                                  ({(file.file_size / 1024).toFixed(2)} KB)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Manage Tags</h2>
          </div>
          <div className={styles.tagsTable}>
            <div className={styles.tagInputRow}>
              <input
                type="text"
                placeholder="New tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                className={styles.tagInput}
              />
              <Button
                onClick={handleCreateTag}
                color={Colors.primary}
                title="+ Create Tag"
                disabled={!newTagName.trim()}
              />
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tag Name</th>
                  <th>Slug</th>
                  <th>Maps Using</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>
                      No tags yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  tags.map((tag) => (
                    <tr key={tag.id}>
                      <td>
                        {editingTagId === tag.id ? (
                          <input
                            type="text"
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateTag(tag.id)}
                            className={styles.tagEditInput}
                            autoFocus
                          />
                        ) : (
                          tag.name
                        )}
                      </td>
                      <td className={styles.slugText}>{tag.slug}</td>
                      <td className={styles.centerText}>{tag.mapCount}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {editingTagId === tag.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateTag(tag.id)}
                                className={`${styles.iconButton} ${styles.saveIcon}`}
                                title="Save tag"
                              >
                                <MdSave />
                              </button>
                              <button
                                onClick={cancelEditingTag}
                                className={`${styles.iconButton} ${styles.cancelIcon}`}
                                title="Cancel editing"
                              >
                                <MdCancel />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditingTag(tag)}
                                className={`${styles.iconButton} ${styles.editIcon}`}
                                title="Edit tag"
                              >
                                <MdEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteTag(tag.id, tag.name)}
                                className={`${styles.iconButton} ${styles.deleteIcon}`}
                                title="Delete tag"
                              >
                                <MdDelete />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default FoundryMapsAdmin;
