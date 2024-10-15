import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface BottomImageCarouselSidebarPanelProps {
  data: any;
  setData: (data: any) => void;
}

const BottomImageCarouselSidebarPanel: React.FC<BottomImageCarouselSidebarPanelProps> = ({ data, setData }) => {
  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...(data.props?.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    setData({ ...data, props: { ...data.props, images: newImages } });
  };

  const addImage = () => {
    setData({
      ...data,
      props: {
        ...data.props,
        images: [...(data.props?.images || []), { url: '', alt: '' }],
      },
    });
  };

  const removeImage = (index: number) => {
    const newImages = data.props.images.filter((_: any, i: number) => i !== index);
    setData({ ...data, props: { ...data.props, images: newImages } });
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        Bottom Image Carousel
      </Typography>

      {/* First Image Input Fields */}
      <Typography variant="subtitle1" sx={{ marginTop: '16px' }}>
        Image 1
      </Typography>
      <Box sx={{ marginTop: '12px' }}>
        <TextField
          fullWidth
          label="Image 1 URL"
          value={data.props?.images?.[0]?.url || ''}
          onChange={(e) => handleImageChange(0, 'url', e.target.value)}
          sx={{ marginBottom: '8px' }}
        />
        <TextField
          fullWidth
          label="Image 1 Alt Text"
          value={data.props?.images?.[0]?.alt || ''}
          onChange={(e) => handleImageChange(0, 'alt', e.target.value)}
        />
      </Box>

      {/* Additional Images */}
      <Typography variant="subtitle1" sx={{ marginTop: '16px' }}>
        Additional Images
      </Typography>
      {data.props?.images?.slice(1).map((image: any, index: number) => (
        <Box key={index + 1} sx={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TextField
            fullWidth
            label={`Image ${index + 2} URL`}
            value={image.url}
            onChange={(e) => handleImageChange(index + 1, 'url', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            fullWidth
            label={`Image ${index + 2} Alt Text`}
            value={image.alt}
            onChange={(e) => handleImageChange(index + 1, 'alt', e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => removeImage(index + 1)}
            sx={{ height: 'fit-content' }}
          >
            Remove
          </Button>
        </Box>
      ))}

      <Button
        onClick={addImage}
        variant="contained"
        sx={{ marginTop: '16px', display: 'block', marginLeft: 'auto' }}
      >
        Add Image
      </Button>
    </Box>
  );
};

export default BottomImageCarouselSidebarPanel;
