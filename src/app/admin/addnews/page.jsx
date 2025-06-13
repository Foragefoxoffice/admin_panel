'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { MathJaxContext } from 'better-react-mathjax';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListIcon,
  ListOrderedIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  MinusIcon,
  ImageIcon,
  Trash2Icon,
  MoveLeftIcon,
  MoveRightIcon,
  Maximize2Icon,
  Minimize2Icon,
  LinkIcon,
  ImagePlusIcon, 
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
} from 'lucide-react';

// Custom Image extension with better handling
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width') || '100%',
        renderHTML: attributes => ({ width: attributes.width }),
      },
      align: {
        default: 'center',
        parseHTML: element => {
          const float = element.style.float;
          return float || 'center';
        },
        renderHTML: attributes => {
          if (!attributes.align || attributes.align === 'center') return {};
          return {
            style: `float: ${attributes.align}; margin-${attributes.align === 'left' ? 'right' : 'left'}: 15px;`
          };
        },
      },
    };
  },
});

export default function CreateNewsPage() {
  const [form, setForm] = useState({ title: '', content: '', image: null });
  const [preview, setPreview] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const fileInputRef = useRef(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        paragraph: {
          HTMLAttributes: {
            class: 'my-2',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right'],
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg my-4 transition-all duration-200',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setForm(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      handleClick(view, pos, event) {
        const node = view.state.doc.nodeAt(pos);
        if (node && node.type.name === 'image') {
          setActiveMedia({
            node: node,
            pos: pos,
            attrs: node.attrs
          });
          return true;
        }
        setActiveMedia(null);
        return false;
      },
      handleDOMEvents: {
        drop: (view, event) => {
          const hasFiles = event.dataTransfer?.files?.length > 0;
          if (!hasFiles) return false;
          
          const files = Array.from(event.dataTransfer.files);
          const images = files.filter(file => /image/i.test(file.type));
          
          if (images.length === 0) return false;
          
          event.preventDefault();
          
          // Handle single image drop
          if (images.length === 1) {
            const file = images[0];
            const reader = new FileReader();
            reader.onload = () => {
              editor
                .chain()
                .focus()
                .setImage({ src: reader.result })
                .run();
            };
            reader.readAsDataURL(file);
          }
          return true;
        },
      },
    },
  });

  // Close media dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mediaDialogOpen && !event.target.closest('.media-dialog')) {
        setMediaDialogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mediaDialogOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addMedia = useCallback(() => {
    if (!mediaUrl) return;
    
    editor.chain().focus().setImage({ src: mediaUrl }).run();
    setMediaUrl('');
    setMediaDialogOpen(false);
  }, [editor, mediaUrl]);



// Updated handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form fields
  if (!form.title.trim()) {
    alert('Please enter a news title');
    return;
  }

  if (!form.content || form.content === '<p></p>') {
    alert('Please add some content to your news article');
    return;
  }

  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    
    if (form.image) {
      formData.append('image', form.image);
    }

    // Submit to API endpoint
    const response = await fetch('http://localhost:5000/api/news', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create news');
    }

    const data = await response.json();
    
    // Reset form on success
    setForm({ title: '', content: '', image: null });
    setPreview(null);
    if (editor) {
      editor.commands.clearContent();
    }
    
    // Show animated success popup
    setShowSuccessPopup(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);

  } catch (error) {
    console.error('Error submitting form:', error);
    alert(`Error: ${error.message}`);
  }
};

  const updateMediaAttributes = (attrs) => {
    if (!activeMedia) return;
    
    editor
      .chain()
      .focus()
      .setNodeSelection(activeMedia.pos)
      .updateAttributes('image', attrs)
      .run();
    
    setActiveMedia({
      ...activeMedia,
      attrs: {
        ...activeMedia.attrs,
        ...attrs
      }
    });
  };

  const removeMedia = () => {
    if (!activeMedia) return;
    
    editor
      .chain()
      .focus()
      .setNodeSelection(activeMedia.pos)
      .deleteSelection()
      .run();
    
    setActiveMedia(null);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    
    <MathJaxContext>
        <AnimatePresence>
  {showSuccessPopup && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      News published successfully!
    </motion.div>
  )}
</AnimatePresence>
      <div className=" pb-10 px-4">
        <div className=" bg-white rounded-2xl">
          <h1 className="font-bold mb-6">Create News</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Enter news title"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              value={form.title}
              required
            />

            {/* Rich Editor Toolbar */}
            {editor && (
              <>
                <div className="flex flex-wrap gap-2 border p-2 rounded-lg bg-gray-50">
                  {/* Heading levels */}
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Heading 1"
                  >
                    <Heading1 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Heading 2"
                  >
                    <Heading2 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Heading 3"
                  >
                    <Heading3 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 4 }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Heading 4"
                  >
                    <Heading4 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 5 }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Heading 5"
                  >
                    <Heading5 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 6 }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Heading 6"
                  >
                    <Heading6 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`p-2 rounded ${editor.isActive('paragraph') ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Paragraph"
                  >
                    <Pilcrow size={18} />
                  </button>
                  
                  {/* Divider */}
                  <div className="h-8 w-px bg-gray-300 mx-1"></div>
                  
                  {/* Text formatting */}
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${editor.isActive('bold') ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Bold"
                  >
                    <BoldIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${editor.isActive('italic') ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Italic"
                  >
                    <ItalicIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded ${editor.isActive('underline') ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Underline"
                  >
                    <UnderlineIcon size={18} />
                  </button>
                  
                  {/* Lists */}
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Bullet List"
                  >
                    <ListIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Numbered List"
                  >
                    <ListOrderedIcon size={18} />
                  </button>
                  
                  {/* Alignment */}
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Align Left"
                  >
                    <AlignLeftIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Align Center"
                  >
                    <AlignCenterIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                    title="Align Right"
                  >
                    <AlignRightIcon size={18} />
                  </button>
                  
                  {/* Divider */}
                  <div className="h-8 w-px bg-gray-300 mx-1"></div>
                  
                  {/* Media buttons */}
                  <button 
                    type="button" 
                    onClick={() => setMediaDialogOpen(true)}
                    className="p-2 rounded hover:bg-[#8938d8]"
                    title="Insert Image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-2 rounded hover:bg-[#8938d8]"
                    title="Horizontal Line"
                  >
                    <MinusIcon size={18} />
                  </button>
                </div>

                {/* Bubble menu for text formatting */}
                {editor && (
                  <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex bg-white shadow-lg rounded-lg p-1 border">
                      <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1 rounded mx-1 ${editor.isActive('bold') ? 'bg-[#8938d8]' : ''}`}
                      >
                        <BoldIcon size={18} />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1 rounded mx-1 ${editor.isActive('italic') ? 'bg-[#8938d8]' : ''}`}
                      >
                        <ItalicIcon size={18} />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleLink({ href: '' }).run()}
                        className={`p-1 rounded mx-1 ${editor.isActive('link') ? 'bg-[#8938d8]' : ''}`}
                      >
                        <LinkIcon size={18} />
                      </button>
                    </div>
                  </BubbleMenu>
                )}
              </>
            )}

            {/* Media Dialog */}
            {mediaDialogOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="media-dialog bg-white p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Add Image</h3>
                  
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Image URL</label>
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      className="w-full border border-gray-300 p-2 rounded-lg"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Or Upload Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={openFileDialog}
                      className="w-full border border-dashed border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50"
                    >
                      <ImagePlusIcon size={24} className="mb-2 text-gray-400" />
                      <span className="text-gray-500">Click to upload</span>
                    </button>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      onClick={() => {
                        setMediaDialogOpen(false);
                        setMediaUrl('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                      onClick={addMedia}
                      disabled={!mediaUrl}
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Media Controls */}
            {activeMedia && (
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                <button 
                  type="button"
                  onClick={() => updateMediaAttributes({ align: 'left' })}
                  className={`p-2 rounded ${activeMedia.attrs.align === 'left' ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                  title="Align Left"
                >
                  <MoveLeftIcon size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => updateMediaAttributes({ align: 'center' })}
                  className={`p-2 rounded ${activeMedia.attrs.align === 'center' ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                  title="Align Center"
                >
                  <AlignCenterIcon size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => updateMediaAttributes({ align: 'right' })}
                  className={`p-2 rounded ${activeMedia.attrs.align === 'right' ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                  title="Align Right"
                >
                  <MoveRightIcon size={16} />
                </button>
                
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                
                <button 
                  type="button"
                  onClick={() => updateMediaAttributes({ width: '50%' })}
                  className={`p-2 rounded ${activeMedia.attrs.width === '50%' ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                  title="Medium Size"
                >
                  <Minimize2Icon size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => updateMediaAttributes({ width: '100%' })}
                  className={`p-2 rounded ${activeMedia.attrs.width === '100%' ? 'bg-[#8938d8]' : 'hover:bg-[#8938d8]'}`}
                  title="Full Width"
                >
                  <Maximize2Icon size={16} />
                </button>
                
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                
                <button 
                  type="button"
                  onClick={removeMedia}
                  className="p-2 rounded text-red-500 hover:bg-red-100"
                  title="Remove"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            )}

            {/* Rich Text Editor Content */}
            <div className="border rounded-lg min-h-[200px] p-4 bg-white shadow-inner">
              <EditorContent editor={editor} />
            </div>

            {/* News Cover Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-semibold">News Cover Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border rounded-md p-2"
                onChange={handleImageChange}
              />
              {preview && (
                <img src={preview} alt="Preview" className="mt-4 max-h-64 rounded-md shadow" />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full"
            >
              Publish News
            </button>
          </form>
        </div>
      </div>
    </MathJaxContext>
  );
}